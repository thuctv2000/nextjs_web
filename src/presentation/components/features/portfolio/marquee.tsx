'use client';

import { useEffect, useRef } from 'react';
import { marqueeSkills } from '@/lib/portfolio-data';

interface ChunkProps {
  items: string[];
}

function Chunk({ items }: ChunkProps) {
  return (
    <div className="marquee-chunk">
      {items.map((s, i) => (
        <span key={i}>
          {s}
          <span className="sep"> ✳ </span>
        </span>
      ))}
    </div>
  );
}

export function Marquee() {
  const bandRef = useRef<HTMLDivElement>(null);

  // pause the infinite animations while the band is off screen
  useEffect(() => {
    const band = bandRef.current!;
    const io = new IntersectionObserver((entries) => {
      band.classList.toggle('paused', !entries[0].isIntersecting);
    });
    io.observe(band);
    return () => io.disconnect();
  }, []);

  const half1 = marqueeSkills.slice(0, 8);
  const half2 = marqueeSkills.slice(8);
  return (
    <div className="marquee-band" aria-hidden ref={bandRef}>
      <div className="marquee-row">
        <Chunk items={half1} />
        <Chunk items={half1} />
      </div>
      <div className="marquee-row reverse">
        <Chunk items={half2} />
        <Chunk items={half2} />
      </div>
    </div>
  );
}
