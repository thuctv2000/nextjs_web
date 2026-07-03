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
    const chars = root.querySelectorAll<HTMLElement>('.hero-title .char');
    const reveals = root.querySelectorAll('.hero-reveal');

    let played = false;
    const play = () => {
      if (played) return;
      played = true;

      // each letter drops in standing on the particle net, bobs with the
      // waves, then walks up into its slot in the title one by one
      chars.forEach((char, i) => {
        const surfaceY = window.innerHeight * 0.52;
        const driftX = gsap.utils.random(-0.12, 0.12) * window.innerWidth;

        gsap.set(char, {
          y: surfaceY,
          x: driftX,
          scale: 0.38,
          rotation: gsap.utils.random(-10, 10),
          opacity: 0,
        });

        // surface bob — killed automatically when the departure tween
        // overwrites y/rotation
        gsap.to(char, {
          opacity: 1,
          duration: 0.45,
          ease: 'power2.out',
          delay: 0.18 * i,
        });
        gsap.to(char, {
          y: surfaceY - 16,
          rotation: gsap.utils.random(-6, 6),
          duration: gsap.utils.random(0.6, 0.9),
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: 0.18 * i,
        });

        // departure: one letter at a time rises into position
        gsap.to(char, {
          y: 0,
          x: 0,
          scale: 1,
          rotation: 0,
          duration: 1.15,
          ease: 'power3.inOut',
          delay: 1.2 + i * 0.5,
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
    };

    window.addEventListener('preloader:done', play);
    // fallback if preloader already finished / absent
    const fallback = setTimeout(play, 3200);

    return () => {
      window.removeEventListener('preloader:done', play);
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
              <span className="char" key={i}>
                {c}
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
