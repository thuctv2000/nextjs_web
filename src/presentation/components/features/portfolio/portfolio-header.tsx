'use client';

import { useEffect, useState } from 'react';
import { navLinks, profile } from '@/lib/portfolio-data';
import { ThemeToggle } from './theme-toggle';

interface RollProps {
  text: string;
}

function Roll({ text }: RollProps) {
  return (
    <span className="roll">
      <span data-text={text}>{text}</span>
    </span>
  );
}

export function PortfolioHeader() {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const ids = navLinks.map((l) => l.href.slice(1));
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      // a section is "active" while it crosses the upper-middle band
      { rootMargin: '-20% 0px -70% 0px' }
    );
    sections.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <header className="site-header">
        <a href="#intro" className="logo" aria-label="Back to top">
          <span className="dot" />
        </a>
        <span className="site-tagline label-strong">{profile.tagline}</span>
        <nav className="site-nav label-strong">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={activeId === l.href.slice(1) ? 'active' : undefined}
            >
              <Roll text={l.label} />
            </a>
          ))}
          <ThemeToggle />
        </nav>
      </header>
      <div className="side-tab">
        <span className="tab-dot" />
        TVT-1 MODEL · MOBILE DEVELOPER
      </div>
    </>
  );
}
