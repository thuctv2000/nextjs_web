'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import dynamic from 'next/dynamic';
import { profile } from '@/lib/portfolio-data';
import type { DuneApi } from './particle-field';

const ParticleField = dynamic(
  () => import('./particle-field').then((mod) => mod.ParticleField),
  { ssr: false }
);

// line 1 breathes between the word and its meaning
const WORD = 'LAZY';
const PHRASE = 'LESS WORK, MORE SHIPPED';
const HOLD_WORD_MS = 3400;
const HOLD_PHRASE_MS = 4600;

function smoothstep(a: number, b: number, v: number): number {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

interface RideState {
  char: HTMLElement;
  xWorld: number;
  zFar: number;
  zNear: number;
  finalX: number;
  finalBottom: number;
  phase: number;
  progress: { t: number };
  done: boolean;
}

export function HeroSection() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current!;
    const title = root.querySelector<HTMLElement>('.hero-title')!;
    const line = root.querySelector<HTMLElement>('.line-rotor')!;
    const chars = root.querySelectorAll<HTMLElement>('.hero-title .char');
    const reveals = root.querySelectorAll('.hero-reveal');

    let played = false;
    let showingPhrase = false;
    let handoff: ReturnType<typeof setTimeout> | undefined;
    let breath: ReturnType<typeof setTimeout> | undefined;

    // after the entrance, line 1 is owned imperatively: React never
    // re-renders it, so the DOM swap below is safe
    const rebuildLine = (text: string): NodeListOf<HTMLElement> => {
      line.innerHTML = '';
      for (const c of text.split('')) {
        const mask = document.createElement('span');
        mask.className = 'mask';
        const char = document.createElement('span');
        char.className = 'char';
        char.textContent = c === ' ' ? ' ' : c;
        mask.appendChild(char);
        line.appendChild(mask);
      }
      return line.querySelectorAll<HTMLElement>('.char');
    };

    // roll the current text up and out, swap word ⇄ phrase, roll back in
    const swap = () => {
      const current = line.querySelectorAll<HTMLElement>('.char');
      gsap.to(current, {
        yPercent: -115,
        duration: 0.4,
        ease: 'power2.in',
        stagger: 0.03,
        onComplete: () => {
          showingPhrase = !showingPhrase;
          line.classList.toggle('phrase', showingPhrase);
          const fresh = rebuildLine(showingPhrase ? PHRASE : WORD);
          gsap.set(fresh, { yPercent: 115, opacity: 1 });
          gsap.to(fresh, {
            yPercent: 0,
            duration: 0.5,
            ease: 'power3.out',
            stagger: 0.025,
          });
          breath = setTimeout(swap, showingPhrase ? HOLD_PHRASE_MS : HOLD_WORD_MS);
        },
      });
    };

    // entrance: letters spawn far out ON the dune surface, ride the actual
    // waves (projected from the 3D scene each frame), then slide toward the
    // camera and lift into the two-line title one by one
    let rideTicker: (() => void) | null = null;

    const play = () => {
      if (played) return;
      played = true;

      const dune = (window as unknown as { __dune?: DuneApi }).__dune;

      if (dune) {
        const states: RideState[] = [];
        const total = chars.length;
        const lineEls = root.querySelectorAll('.hero-line');
        lineEls.forEach((lineEl, row) => {
          const rowChars = lineEl.querySelectorAll<HTMLElement>('.char');
          rowChars.forEach((char) => {
            const rect = char.getBoundingClientRect();
            const i = states.length;
            const state: RideState = {
              char,
              // one readable rank: "LAZY PANDA" left→right on the surface,
              // with a small gap between the two words
              xWorld:
                (i / (total - 1) - 0.5) * 24 +
                (row === 1 ? 1.6 : -1.6) +
                gsap.utils.random(-0.4, 0.4),
              zFar: -4 + gsap.utils.random(-1, 1),
              zNear: 10.5 + gsap.utils.random(0, 1.5),
              finalX: rect.left + rect.width / 2,
              finalBottom: rect.bottom,
              phase: Math.random() * Math.PI * 2,
              progress: { t: 0 },
              done: false,
            };
            states.push(state);

            gsap.set(char, { opacity: 0, transformOrigin: '50% 100%' });
            gsap.to(char, {
              opacity: 1,
              duration: 0.5,
              ease: 'power2.out',
              delay: 0.1 * i,
            });
            gsap.to(state.progress, {
              t: 1,
              duration: 1.7,
              ease: 'power2.inOut',
              delay: 1.4 + i * 0.22,
              onComplete: () => {
                state.done = true;
                gsap.set(char, { x: 0, y: 0, scale: 1, rotation: 0 });
              },
            });
          });
        });

        rideTicker = () => {
          const now = performance.now() / 1000;
          let active = false;
          for (const s of states) {
            if (s.done) continue;
            active = true;
            const z = s.zFar + (s.zNear - s.zFar) * s.progress.t;
            const p = dune.project(s.xWorld, z);
            // ride the surface for most of the trip, lift into the title
            // slot only at the very end
            const mix = smoothstep(0.68, 1, s.progress.t);
            const scaleProj = Math.min(1, 6.2 / p.dist);
            gsap.set(s.char, {
              x: (p.x - s.finalX) * (1 - mix),
              y: (p.y - s.finalBottom) * (1 - mix),
              scale: scaleProj + (1 - scaleProj) * mix,
              rotation: Math.sin(now * 2 + s.phase) * 4 * (1 - mix),
            });
          }
          if (!active && rideTicker) {
            gsap.ticker.remove(rideTicker);
            rideTicker = null;
          }
        };
        gsap.ticker.add(rideTicker);
      } else {
        // WebGL absent: simple fade-up
        chars.forEach((char, i) => {
          gsap.fromTo(
            char,
            { y: 60, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.8 + i * 0.08 }
          );
        });
      }

      gsap.to(reveals, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.12,
        delay: 0.4,
      });

      // hand line 1 over to the breathing loop once every letter settled
      const settle = 1.4 + (chars.length - 1) * 0.22 + 1.7;
      handoff = setTimeout(() => {
        title.classList.add('cycling');
        breath = setTimeout(swap, HOLD_WORD_MS);
      }, settle * 1000 + 500);
    };

    window.addEventListener('preloader:done', play);
    // fallback if preloader already finished / absent
    const fallback = setTimeout(play, 3200);

    return () => {
      window.removeEventListener('preloader:done', play);
      clearTimeout(fallback);
      if (handoff) clearTimeout(handoff);
      if (breath) clearTimeout(breath);
      if (rideTicker) gsap.ticker.remove(rideTicker);
      gsap.killTweensOf(line.querySelectorAll('.char'));
    };
  }, []);

  return (
    <section id="intro" className="hero" ref={rootRef}>
      <ParticleField />
      <div className="hero-inner">
        <div className="hero-title-wrap">
          <span className="hero-overline label hero-reveal">
            {profile.name.toUpperCase()} — {profile.role.toUpperCase()}
            <span className="overline-tail"> · FLUTTER / REACT NATIVE / NATIVE</span>
          </span>
          <h1
            className="hero-title"
            aria-label="LAZY PANDA — LESS WORK, MORE SHIPPED"
          >
            <span className="hero-line line-rotor" aria-hidden>
              {WORD.split('').map((c, i) => (
                <span className="mask" key={i}>
                  <span className="char">{c}</span>
                </span>
              ))}
            </span>
            <span className="hero-line line-spread" aria-hidden>
              {'PANDA'.split('').map((c, i) => (
                <span className="char" key={i}>
                  {c}
                </span>
              ))}
            </span>
          </h1>
        </div>

        <div className="hero-bottom">
          <div className="hero-card hero-reveal">
            <h3>
              Mobile developer,
              <br />
              based in
              <br />
              Ho Chi Minh City.
            </h3>
            <div className="div" />
            <p>
              Three years turning product ideas into apps people actually use — from
              factories to school buses.
            </p>
          </div>

          <p className="hero-blurb hero-reveal">
            {profile.heroBlurb.split('Thuc').map((part, i) =>
              i === 0 ? (
                <span key={i}>{part}</span>
              ) : (
                <span key={i}>
                  <span className="accent">Thuc</span>
                  {part}
                </span>
              )
            )}
          </p>

          <div className="hero-meta hero-reveal">
            <span className="chip label">
              <span className="live" />
              OPEN TO SENIOR ROLES
            </span>
            <span className="label">UIT · COMPUTER SCIENCE</span>
            <span className="label">EST. 2023 — PRESENT</span>
          </div>
        </div>
      </div>
    </section>
  );
}
