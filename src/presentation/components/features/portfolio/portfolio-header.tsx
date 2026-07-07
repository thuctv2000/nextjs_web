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
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  // themed background once off the top; hide on scroll down, reveal on up
  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 24);
        const delta = y - lastY;
        if (y < 80) {
          setHidden(false);
        } else if (delta > 6) {
          setHidden(true);
        } else if (delta < -6) {
          setHidden(false);
        }
        lastY = y;
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
      <header
        className={`site-header${scrolled ? ' scrolled' : ''}${hidden ? ' nav-hidden' : ''}`}
      >
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
