'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import dynamic from 'next/dynamic';
import { profile } from '@/lib/portfolio-data';

const ParticleField = dynamic(
  () => import('./particle-field').then((mod) => mod.ParticleField),
  { ssr: false }
);

export function HeroSection() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current!;
    const chars = root.querySelectorAll('.hero-title .char');
    const reveals = root.querySelectorAll('.hero-reveal');

    const play = () => {
      const tl = gsap.timeline();
      tl.to(chars, {
        y: 0,
        duration: 1.1,
        ease: 'power4.out',
        stagger: 0.05,
      });
      tl.to(
        reveals,
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12 },
        '-=0.6'
      );
    };

    let played = false;
    const onDone = () => {
      if (!played) {
        played = true;
        play();
      }
    };
    window.addEventListener('preloader:done', onDone);
    // fallback if preloader already finished / absent
    const fallback = setTimeout(onDone, 3200);

    return () => {
      window.removeEventListener('preloader:done', onDone);
      clearTimeout(fallback);
    };
  }, []);

  return (
    <section id="intro" className="hero" ref={rootRef}>
      <ParticleField />
      <div className="hero-inner">
        <div className="hero-title-wrap">
          <span className="hero-overline label hero-reveal">
            {profile.role.toUpperCase()} · FLUTTER / REACT NATIVE / NATIVE
          </span>
          <h1 className="hero-title" aria-label={profile.displayName}>
            {profile.displayName.split('').map((c, i) => (
              <span className="mask" key={i}>
                <span className="char" style={{ transform: 'translateY(110%)' }}>
                  {c}
                </span>
              </span>
            ))}
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
