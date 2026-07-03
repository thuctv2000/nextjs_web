'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function BigWord() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current!;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        root.querySelectorAll('h2 .char'),
        { yPercent: 110 },
        {
          yPercent: 0,
          ease: 'power3.out',
          stagger: 0.06,
          scrollTrigger: {
            trigger: root,
            start: 'top 75%',
            end: 'top 20%',
            scrub: 1,
          },
        }
      );
      gsap.fromTo(
        root.querySelector('.sub'),
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: root, start: 'top 40%' },
        }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  const word = 'mobile.';

  return (
    <section className="bigword" ref={rootRef}>
      <div className="glow" />
      <span className="side-label label">CROSS-PLATFORM-FRIENDLY</span>
      <div className="overline-row label">
        <span>100% PRODUCTION-TESTED</span>
      </div>
      <h2 aria-label={word}>
        {word.split('').map((c, i) => (
          <span className="mask" key={i}>
            <span className="char">{c}</span>
          </span>
        ))}
      </h2>
      <p className="sub">
        Pure mobile, crafted cross-platform. Completely native when it counts — and it
        might be full of <em>clean architecture</em>. One codebase, two stores, zero
        excuses.
      </p>
    </section>
  );
}
