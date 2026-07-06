'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { responsibilities } from '@/lib/portfolio-data';

gsap.registerPlugin(ScrollTrigger);

export function Craft() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current!;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        root.querySelectorAll('.craft-row'),
        { opacity: 0, y: 44 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: { trigger: root, start: 'top 70%' },
        }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="craft" className="craft" ref={rootRef}>
      <div className="craft-head">
        <span className="label">WHAT I DO, DAILY</span>
        <span className="label">KEY RESPONSIBILITIES — 07</span>
      </div>
      {responsibilities.map((r, i) => (
        <div className="craft-row" key={i} data-hover>
          <span className="idx">/{String(i + 1).padStart(2, '0')}</span>
          <h3>{r.title}</h3>
          <p>{r.detail}</p>
          <span className="craft-arrow" aria-hidden>
            →
          </span>
        </div>
      ))}
    </section>
  );
}
