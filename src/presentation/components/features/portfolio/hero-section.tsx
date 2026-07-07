'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import dynamic from 'next/dynamic';
import { profile } from '@/lib/portfolio-data';

const ParticleField = dynamic(
  () => import('./particle-field').then((mod) => mod.ParticleField),
  { ssr: false }
);

// line 1 breathes between the word and its meaning
const WORD = 'LAZY';
const PHRASE = 'LESS WORK, MORE SHIPPED';
const HOLD_WORD_MS = 3400;
const HOLD_PHRASE_MS = 4600;

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

    // entrance: letters ride the particle net, bob with the waves, then
    // settle into the two-line title one by one
    const play = () => {
      if (played) return;
      played = true;

      // letters materialize far away on the dune horizon — tiny, hazy,
      // clustered toward the center — then fly forward into the title
      const horizonY = window.innerHeight * 0.4;
      const centerX = window.innerWidth / 2;

      chars.forEach((char, i) => {
        const rect = char.getBoundingClientRect();
        const dy = horizonY - rect.top + gsap.utils.random(-10, 14);
        const dx =
          (centerX - (rect.left + rect.width / 2)) * 0.6 +
          gsap.utils.random(-40, 40);

        gsap.set(char, {
          y: dy,
          x: dx,
          scale: 0.18,
          rotation: gsap.utils.random(-8, 8),
          opacity: 0,
        });

        gsap.to(char, {
          opacity: 0.9,
          duration: 0.45,
          ease: 'power2.out',
          delay: 0.12 * i,
        });
        // sway with the distant waves
        gsap.to(char, {
          y: dy - 7,
          rotation: gsap.utils.random(-5, 5),
          duration: gsap.utils.random(0.6, 0.9),
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: 0.12 * i,
        });

        gsap.to(char, {
          y: 0,
          x: 0,
          scale: 1,
          rotation: 0,
          opacity: 1,
          duration: 1.15,
          ease: 'power3.inOut',
          delay: 1.2 + i * 0.22,
          overwrite: 'auto',
        });
      });

      gsap.to(reveals, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.12,
        delay: 0.4,
      });

      // hand line 1 over to the breathing loop once every letter settled
      const settle = 1.2 + (chars.length - 1) * 0.22 + 1.15;
      handoff = setTimeout(() => {
        title.classList.add('cycling');
        breath = setTimeout(swap, HOLD_WORD_MS);
      }, settle * 1000 + 600);
    };

    window.addEventListener('preloader:done', play);
    // fallback if preloader already finished / absent
    const fallback = setTimeout(play, 3200);

    return () => {
      window.removeEventListener('preloader:done', play);
      clearTimeout(fallback);
      if (handoff) clearTimeout(handoff);
      if (breath) clearTimeout(breath);
      gsap.killTweensOf(line.querySelectorAll('.char'));
    };
  }, []);

  return (
    <section id="intro" className="hero" ref={rootRef}>
      <ParticleField />
      <div className="hero-inner">
        <div className="hero-title-wrap">
          <span className="hero-overline label hero-reveal">
            {profile.name.toUpperCase()} — {profile.role.toUpperCase()} · FLUTTER /
            REACT NATIVE / NATIVE
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
