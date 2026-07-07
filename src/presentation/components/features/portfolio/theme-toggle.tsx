'use client';

import { useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

function readTheme(): Theme {
  return document.documentElement.getAttribute('data-pf-theme') === 'light'
    ? 'light'
    : 'dark';
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    setTheme(readTheme());
  }, []);

  const toggle = (): void => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-pf-theme', next);
    try {
      localStorage.setItem('pf-theme', next);
    } catch {
      // private mode — theme just won't persist
    }
    window.dispatchEvent(new CustomEvent('pf-theme'));
    setTheme(next);
  };

  const label = theme === 'dark' ? 'LIGHT' : 'DARK';

  return (
    <button
      type="button"
      className="theme-toggle label-strong"
      onClick={toggle}
      aria-label={`Switch to ${label.toLowerCase()} mode`}
      data-hover
    >
      <span className="roll">
        <span data-text={`◐ ${label}`}>◐ {label}</span>
      </span>
    </button>
  );
}
