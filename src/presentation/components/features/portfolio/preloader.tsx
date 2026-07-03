'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export function Preloader() {
  const [gone, setGone] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const counter = { v: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        window.dispatchEvent(new CustomEvent('preloader:done'));
        setGone(true);
      },
    });
    tl.to(counter, {
      v: 100,
      duration: 1.5,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (numRef.current)
          numRef.current.textContent = String(Math.round(counter.v)).padStart(3, '0');
      },
    });
    tl.to(rootRef.current, {
      yPercent: -100,
      duration: 0.9,
      ease: 'power4.inOut',
    });
    return () => {
      tl.kill();
    };
  }, []);

  if (gone) return null;

  return (
    <div ref={rootRef} className="preloader">
      <div className="boot label">
        <span>TVT-1 MODEL</span>
        <span>BOOTING PORTFOLIO RUNTIME…</span>
        <span>HO CHI MINH CITY · {new Date().getFullYear()}</span>
      </div>
      <div className="count">
        <span ref={numRef}>000</span>
      </div>
    </div>
  );
}
