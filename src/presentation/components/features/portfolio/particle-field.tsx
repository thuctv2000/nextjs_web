'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

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

// CPU mirror of the vertex-shader noise so DOM elements can ride the dunes
function hash2(x: number, y: number): number {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

function noise2(x: number, y: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  const a = hash2(ix, iy);
  const b = hash2(ix + 1, iy);
  const c = hash2(ix, iy + 1);
  const d = hash2(ix + 1, iy + 1);
  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
}

function duneHeight(x: number, z: number, t: number): number {
  return (
    noise2(x * 0.09 + t, z * 0.09 + t) * 1.6 +
    noise2(x * 0.22 - t * 0.6, z * 0.22 - t * 0.6) * 0.7
  );
}

export interface DuneApi {
  project: (x: number, z: number) => { x: number; y: number; dist: number };
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

    // let the DOM hero letters stand on / ride the same surface: project a
    // dune point (world x,z) to screen px using the live camera
    const projV = new THREE.Vector3();
    const dune: DuneApi = {
      project(x: number, z: number) {
        const t = clock.getElapsedTime() * 0.25;
        const y = duneHeight(x, z, t);
        projV.set(x, y, z);
        const dist = camera.position.distanceTo(projV);
        projV.project(camera);
        return {
          x: (projV.x * 0.5 + 0.5) * wrap.clientWidth,
          y: (-projV.y * 0.5 + 0.5) * wrap.clientHeight,
          dist,
        };
      },
    };
    (window as unknown as { __dune?: DuneApi }).__dune = dune;

    let raf = 0;
    const loop = () => {
      const t = clock.getElapsedTime();
      mouse.lerp(target, 0.05);
      mat.uniforms.uTime.value = t;
      mat.uniforms.uMouse.value.copy(mouse);
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
      delete (window as unknown as { __dune?: DuneApi }).__dune;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', onResize);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
      wrap.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={wrapRef} className="hero-canvas" aria-hidden />;
}
