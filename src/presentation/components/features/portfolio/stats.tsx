'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { stats } from '@/lib/portfolio-data';

gsap.registerPlugin(ScrollTrigger);

export function Stats() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current!;
    const ctx = gsap.context(() => {
      root.querySelectorAll<HTMLElement>('.stat .val').forEach((el) => {
        const end = Number(el.dataset.value || '0');
        const counter = { v: 0 };
        gsap.to(counter, {
          v: end,
          duration: 1.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: root, start: 'top 75%' },
          onUpdate: () => {
            el.textContent = String(Math.round(counter.v)).padStart(2, '0');
          },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="stats section-pad" ref={rootRef}>
      {stats.map((s, i) => (
        <div className="stat" key={i}>
          <div className="num">
            <span className="val" data-value={s.value}>
              00
            </span>
            <span className="suffix">{s.suffix || ' '}</span>
          </div>
          <div className="lbl label">{s.label.toUpperCase()}</div>
        </div>
      ))}
    </section>
  );
}
