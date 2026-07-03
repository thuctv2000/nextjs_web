'use client';

import { useEffect, useRef } from 'react';

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // touch devices: CSS hides the cursor — skip the rAF loop entirely
    if (window.matchMedia('(hover: none)').matches) return;
    const dot = dotRef.current!;
    const ring = ringRef.current!;
    let mx = -100;
    let my = -100;
    let rx = -100;
    let ry = -100;
    let raf: number;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };

    const loop = () => {
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      dot.style.transform = `translate(${mx}px, ${my}px)`;
      ring.style.transform = `translate(${rx}px, ${ry}px) ${
        ring.classList.contains('is-hover') ? 'scale(1.8)' : ''
      }`;
      raf = requestAnimationFrame(loop);
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest('a, button, [data-hover]')) ring.classList.add('is-hover');
      else ring.classList.remove('is-hover');
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring" />
      <div ref={dotRef} className="cursor-dot" />
    </>
  );
}
