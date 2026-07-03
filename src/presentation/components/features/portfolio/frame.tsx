'use client';

import { useEffect, useState } from 'react';

export function Frame() {
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const check = () => {
      const footer = document.querySelector('.site-footer-row');
      if (footer) {
        setAtEnd(footer.getBoundingClientRect().top < window.innerHeight);
      }
    };
    // scroll events for immediacy + rAF poll so state self-corrects on any
    // rendered frame (identical setState values skip re-renders)
    let raf = 0;
    const loop = () => {
      check();
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('scroll', check, { passive: true });
    raf = requestAnimationFrame(loop);
    check();
    return () => {
      window.removeEventListener('scroll', check);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <span className="corner-dot" style={{ top: 28, left: 14 }} />
      <span className="corner-dot" style={{ bottom: 28, right: 14 }} />
      <div className={`scroll-cue label ${atEnd ? 'hidden' : ''}`}>
        <span className="circ">↓</span>
        <span>SCROLL TO CONTINUE</span>
      </div>
    </>
  );
}
