'use client';

import { useEffect, useState } from 'react';

export function Frame() {
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const footer = document.querySelector('.site-footer-row');
    if (!footer) return;
    const io = new IntersectionObserver((entries) => {
      setAtEnd(entries[0].isIntersecting);
    });
    io.observe(footer);
    return () => io.disconnect();
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
