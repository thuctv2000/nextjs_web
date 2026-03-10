'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { PortfolioHeader } from '@/presentation/components/features/portfolio/portfolio-header';
import { ContactSection } from '@/presentation/components/features/portfolio/contact-section';

interface PortfolioPageProps {
  children: ReactNode;
}

export function PortfolioPage({ children }: PortfolioPageProps) {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    function handleScroll(): void {
      const sections = ['home', 'projects', 'contact'];
      for (const id of sections.reverse()) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 200) {
          setActiveSection(id);
          break;
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <PortfolioHeader activeSection={activeSection} />
      {children}
      <ContactSection />
    </div>
  );
}
