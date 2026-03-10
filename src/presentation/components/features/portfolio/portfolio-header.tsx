'use client';

import { useState } from 'react';

interface PortfolioHeaderProps {
  activeSection: string;
}

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

export function PortfolioHeader({ activeSection }: PortfolioHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  function handleNavClick(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  }

  return (
    <header className="fixed top-0 w-full z-50 glass-panel border-b border-surface-border h-16 flex items-center justify-between px-6 lg:px-12 animate-portfolio-fade-in">
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-primary text-2xl">code_blocks</span>
        <span className="font-[family-name:var(--font-display)] font-bold tracking-tight text-text-primary">TVT</span>
      </div>

      <nav className="hidden md:flex gap-8">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.id)}
            className={`text-sm font-medium transition-colors ${
              activeSection === item.id
                ? 'text-primary border-b-2 border-primary pb-1'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <button
        className="md:hidden text-text-muted"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <span className="material-symbols-outlined">
          {isMobileMenuOpen ? 'close' : 'menu'}
        </span>
      </button>

      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 glass-panel border-t border-surface-border md:hidden">
          <div className="flex flex-col p-4 gap-2">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-left text-sm font-medium py-2 px-4 rounded-lg transition-colors ${
                  activeSection === item.id
                    ? 'text-primary bg-primary/10'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
