'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from '@/lib/portfolio-data';

gsap.registerPlugin(ScrollTrigger);

export function ProjectsSection() {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current!;
    const track = trackRef.current!;
    const mm = gsap.matchMedia(root);

    // desktop: pinned horizontal scrub
    mm.add('(min-width: 901px)', () => {
      const distance = () => track.scrollWidth - window.innerWidth;
      gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: () => `+=${distance()}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        },
      });
    });

    // mobile: cards stack vertically, reveal on enter
    mm.add('(max-width: 900px)', () => {
      root.querySelectorAll('.project-card').forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 85%' },
          }
        );
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="projects" className="projects" ref={rootRef}>
      <div className="projects-track" ref={trackRef}>
        <div className="projects-intro">
          <span className="label" style={{ color: 'var(--pf-color-grey-brown)' }}>
            SELECTED WORK — 2023 → NOW
          </span>
          <h2>
            Shipped
            <br />
            <span className="alt">projects</span>
          </h2>
          <p>
            Five production apps across factories, logistics fleets, co-working spaces,
            school buses and point-of-sale — keep scrolling.
          </p>
          <span className="arrow">→→→</span>
        </div>

        {projects.map((p) => (
          <article
            className="project-card"
            key={p.index}
            style={{ ['--accent' as string]: p.accent }}
            data-hover
          >
            <div className="top">
              <span className="p-idx">{p.index}</span>
              <span className="p-role label">{p.role.toUpperCase()}</span>
            </div>
            <h3>{p.name}</h3>
            <p className="p-desc">{p.description}</p>
            <div className="p-tech">
              {p.tech.map((t, i) => (
                <span key={i}>{t}</span>
              ))}
            </div>
            <ul>
              {p.highlights.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </article>
        ))}

        <div className="projects-outro">
          <span className="big-arrow">⟶ fin.</span>
        </div>
      </div>
    </section>
  );
}
