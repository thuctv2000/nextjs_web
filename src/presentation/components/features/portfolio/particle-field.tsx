'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

const VERT = /* glsl */ `
uniform float uTime;
uniform vec2 uMouse;
attribute float aRand;
varying float vElev;
varying float vRand;

// simplex-ish cheap noise
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

void main() {
  vec3 p = position;
  float t = uTime * 0.25;
  float n =
    noise(p.xz * 0.09 + t) * 1.6 +
    noise(p.xz * 0.22 - t * 0.6) * 0.7;
  // mouse swell
  float d = distance(p.xz * 0.02, uMouse * 0.6);
  n += smoothstep(0.5, 0.0, d) * 1.4;
  p.y += n;
  vElev = n;
  vRand = aRand;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = (2.2 + aRand * 2.4) * (14.0 / -mv.z);
}
`;

const FRAG = /* glsl */ `
varying float vElev;
varying float vRand;

void main() {
  vec2 c = gl_PointCoord - 0.5;
  float a = smoothstep(0.5, 0.1, length(c));
  vec3 cream = vec3(1.0, 0.929, 0.843);
  vec3 orange = vec3(0.863, 0.313, 0.0);
  vec3 brown = vec3(0.42, 0.30, 0.19);
  vec3 col = mix(brown, cream, smoothstep(-0.4, 2.2, vElev));
  col = mix(col, orange, smoothstep(1.6, 2.9, vElev) * 0.8);
  gl_FragColor = vec4(col, a * (0.35 + vRand * 0.5));
}
`;

// second system: particles slide across the dune surface, assemble into the
// "THUC" glyph floating above it, then zoom toward the camera and hand off
// to the DOM hero title (herotext:zoom event)
const TEXT_VERT = /* glsl */ `
uniform float uTime;
uniform float uProgress;
uniform float uZoom;
attribute vec3 aTarget;
attribute float aRand;
varying float vRand;
varying float vMix;
varying float vFade;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

void main() {
  // staggered per-particle progress
  float t = clamp((uProgress - aRand * 0.5) / 0.5, 0.0, 1.0);
  t = t * t * (3.0 - 2.0 * t);

  // phase 1: run across the dune surface toward the glyph footprint
  vec3 p;
  p.x = mix(position.x, aTarget.x, t);
  p.z = mix(position.z, aTarget.z, t);
  float tt = uTime * 0.25;
  float duneY =
    noise(p.xz * 0.09 + tt) * 1.6 +
    noise(p.xz * 0.22 - tt * 0.6) * 0.7;

  // phase 2: lift off the surface into the letter shape
  float lift = smoothstep(0.45, 1.0, t);
  p.y = mix(duneY, aTarget.y, lift);

  // wobble while still traveling
  float wob = (1.0 - t) * 0.4;
  p.x += sin(uTime * 2.2 + aRand * 43.0) * wob;
  p.z += cos(uTime * 1.7 + aRand * 31.0) * wob;

  // phase 3: zoom toward the camera, scaling about the glyph center
  vec3 center = vec3(0.0, 3.4, 4.0);
  vec3 zoomed = (p - center) * (1.0 + uZoom * 5.0) + center + vec3(0.0, uZoom * 1.4, uZoom * 9.0);
  p = mix(p, zoomed, uZoom);

  vRand = aRand;
  vMix = t;
  vFade = 1.0 - uZoom;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = (2.0 + aRand * 2.2) * (16.0 / -mv.z) * (1.0 + uZoom * 2.5);
}
`;

const TEXT_FRAG = /* glsl */ `
varying float vRand;
varying float vMix;
varying float vFade;

void main() {
  vec2 c = gl_PointCoord - 0.5;
  float a = smoothstep(0.5, 0.12, length(c));
  vec3 cream = vec3(1.0, 0.929, 0.843);
  vec3 orange = vec3(0.863, 0.313, 0.0);
  vec3 brown = vec3(0.42, 0.30, 0.19);
  // brown while running on the sand, cream once assembled, orange sparkle
  vec3 col = mix(brown, cream, vMix);
  col = mix(col, orange, step(0.82, vRand) * vMix * 0.9);
  gl_FragColor = vec4(col, a * (0.5 + vRand * 0.5) * vFade);
}
`;

// rasterize the word and sample lit pixels into world-space glyph positions
function sampleTextPositions(
  text: string,
  maxCount: number
): { targets: Float32Array; count: number } {
  const W = 640;
  const H = 200;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#fff';
  ctx.font = '900 165px "Arial Black", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, W / 2, H / 2);
  const data = ctx.getImageData(0, 0, W, H).data;

  const pts: number[] = [];
  const STEP = 2;
  const WORLD_W = 14; // glyph width in world units
  const WORLD_H = (WORLD_W * H) / W;
  const CENTER_Y = 3.4;
  const CENTER_Z = 4;
  for (let y = 0; y < H; y += STEP) {
    for (let x = 0; x < W; x += STEP) {
      if (data[(y * W + x) * 4 + 3] > 128) {
        pts.push(
          (x / W - 0.5) * WORLD_W,
          (0.5 - y / H) * WORLD_H + CENTER_Y,
          CENTER_Z + (Math.random() - 0.5) * 0.3
        );
      }
    }
  }

  // shuffle triplets, then cap at maxCount
  const total = pts.length / 3;
  const order = Array.from({ length: total }, (_, i) => i);
  for (let i = total - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  const count = Math.min(total, maxCount);
  const targets = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const s = order[i] * 3;
    targets[i * 3] = pts[s];
    targets[i * 3 + 1] = pts[s + 1];
    targets[i * 3 + 2] = pts[s + 2];
  }
  return { targets, count };
}

export function ParticleField() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current!;
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x100904, 18, 46);

    const camera = new THREE.PerspectiveCamera(
      55,
      wrap.clientWidth / wrap.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 5.2, 16);
    camera.lookAt(0, 0.5, 0);

    const isMobile = window.innerWidth < 768;

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.setSize(wrap.clientWidth, wrap.clientHeight);
    wrap.appendChild(renderer.domElement);

    // point grid on XZ plane — dune field (sparser on mobile GPUs)
    const COLS = isMobile ? 100 : 160;
    const ROWS = isMobile ? 56 : 90;
    const W = 60;
    const D = 34;
    const count = COLS * ROWS;
    const positions = new Float32Array(count * 3);
    const rands = new Float32Array(count);
    let i = 0;
    for (let x = 0; x < COLS; x++) {
      for (let z = 0; z < ROWS; z++) {
        positions[i * 3] = (x / (COLS - 1) - 0.5) * W;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = (z / (ROWS - 1) - 0.5) * D;
        rands[i] = Math.random();
        i++;
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aRand', new THREE.BufferAttribute(rands, 1));

    const mat = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
      },
    });

    const points = new THREE.Points(geo, mat);
    scene.add(points);

    // ---- text particles: scattered on the sand → glyph → zoom handoff ----
    const { targets, count: textCount } = sampleTextPositions(
      'THUC',
      isMobile ? 1800 : 3200
    );
    const textStarts = new Float32Array(textCount * 3);
    const textRands = new Float32Array(textCount);
    for (let k = 0; k < textCount; k++) {
      textStarts[k * 3] = (Math.random() - 0.5) * 48;
      textStarts[k * 3 + 1] = 0; // shader clamps to the dune surface while running
      textStarts[k * 3 + 2] = (Math.random() - 0.5) * 30;
      textRands[k] = Math.random();
    }
    const textGeo = new THREE.BufferGeometry();
    textGeo.setAttribute('position', new THREE.BufferAttribute(textStarts, 3));
    textGeo.setAttribute('aTarget', new THREE.BufferAttribute(targets, 3));
    textGeo.setAttribute('aRand', new THREE.BufferAttribute(textRands, 1));

    const textMat = new THREE.ShaderMaterial({
      vertexShader: TEXT_VERT,
      fragmentShader: TEXT_FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uZoom: { value: 0 },
      },
    });

    const textPoints = new THREE.Points(textGeo, textMat);
    scene.add(textPoints);

    // morph timeline: run on sand → assemble → zoom into the DOM title
    const tl = gsap.timeline({ paused: true });
    tl.to(textMat.uniforms.uProgress, {
      value: 1,
      duration: 2.1,
      ease: 'power2.inOut',
    });
    tl.to(
      textMat.uniforms.uZoom,
      {
        value: 1,
        duration: 1.0,
        ease: 'power3.in',
        onStart: () => {
          window.dispatchEvent(new CustomEvent('herotext:zoom'));
        },
        onComplete: () => {
          textPoints.visible = false;
        },
      },
      '+=0.4'
    );

    let started = false;
    const startMorph = () => {
      if (started) return;
      started = true;
      tl.play();
    };
    window.addEventListener('preloader:done', startMorph);
    // fallback if the preloader already finished / is absent
    const morphFallback = setTimeout(startMorph, 3200);

    const mouse = new THREE.Vector2(0, 0);
    const target = new THREE.Vector2(0, 0);
    const onMove = (e: MouseEvent) => {
      target.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -((e.clientY / window.innerHeight) * 2 - 1)
      );
    };
    window.addEventListener('mousemove', onMove);

    const clock = new THREE.Clock();
    let raf = 0;
    const loop = () => {
      const t = clock.getElapsedTime();
      mouse.lerp(target, 0.05);
      mat.uniforms.uTime.value = t;
      mat.uniforms.uMouse.value.copy(mouse);
      textMat.uniforms.uTime.value = t;
      camera.position.x = mouse.x * 1.6;
      camera.position.y = 5.2 - mouse.y * 0.8;
      camera.lookAt(0, 0.5, 0);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onResize = () => {
      camera.aspect = wrap.clientWidth / wrap.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(wrap.clientWidth, wrap.clientHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(morphFallback);
      tl.kill();
      window.removeEventListener('preloader:done', startMorph);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', onResize);
      geo.dispose();
      mat.dispose();
      textGeo.dispose();
      textMat.dispose();
      renderer.dispose();
      wrap.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={wrapRef} className="hero-canvas" aria-hidden />;
}
