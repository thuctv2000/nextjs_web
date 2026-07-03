'use client';

import { navLinks, profile } from '@/lib/portfolio-data';

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
  return (
    <>
      <header className="site-header">
        <a href="#intro" className="logo">
          <span className="dot" />
          THUC&nbsp;TRAN
        </a>
        <span className="site-tagline label-strong">{profile.tagline}</span>
        <nav className="site-nav label-strong">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href}>
              <Roll text={l.label} />
            </a>
          ))}
        </nav>
      </header>
      <div className="side-tab">
        <span className="tab-dot" />
        TVT-1 MODEL · MOBILE DEVELOPER
      </div>
    </>
  );
}
