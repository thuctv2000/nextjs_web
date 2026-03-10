'use client';

import { useState } from 'react';

export function ContactSection() {
  const [tooltipVisible, setTooltipVisible] = useState(false);

  async function handleCopyEmail(): Promise<void> {
    try {
      await navigator.clipboard.writeText('tranvanthuc2dev@gmail.com');
      setTooltipVisible(true);
      setTimeout(() => setTooltipVisible(false), 2000);
    } catch {
      // Fallback for older browsers
    }
  }

  return (
    <section id="contact" className="flex flex-col items-center justify-center p-6 py-20 md:py-32">
      <div className="w-full max-w-[600px] flex flex-col items-center text-center gap-12 relative">
        {/* Background decorative glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-primary/5 blur-[100px] rounded-full pointer-events-none z-0" />

        <div className="flex flex-col gap-4 z-10 w-full">
          <h2 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl font-bold tracking-tight text-text-primary">
            Let&apos;s Build Something
          </h2>
          <p className="text-text-muted text-lg max-w-md mx-auto">
            Currently open for new opportunities. Reach out to discuss your next mobile
            project.
          </p>
        </div>

        <div className="flex flex-col w-full gap-6 z-10">
          {/* Email Block */}
          <button
            onClick={handleCopyEmail}
            className="group relative flex flex-col items-center justify-center p-8 glass-panel rounded-xl hover:bg-surface/50 transition-all cursor-pointer overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <div className="flex items-center gap-3 mb-2 text-text-muted group-hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-xl">mail</span>
              <span className="text-sm font-medium font-[family-name:var(--font-mono)] uppercase tracking-wider">
                Email
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-[family-name:var(--font-display)] text-2xl md:text-[32px] font-bold text-text-primary hover-underline-animation truncate max-w-[80vw]">
                tranvanthuc2dev@gmail.com
              </span>
              <span className="material-symbols-outlined text-text-muted group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100 -ml-2">
                content_copy
              </span>
            </div>
            {/* Tooltip */}
            <div
              className={`absolute top-4 right-4 bg-primary/10 text-primary text-xs font-[family-name:var(--font-mono)] px-2 py-1 rounded border border-primary/20 transition-opacity duration-300 ${
                tooltipVisible ? 'opacity-100' : 'opacity-0'
              }`}
            >
              Copied to clipboard
            </div>
          </button>

          {/* Phone Block */}
          <div className="flex flex-col items-center justify-center p-6 glass-panel rounded-xl hover:border-primary/30 transition-colors">
            <div className="flex items-center gap-2 mb-2 text-text-muted">
              <span className="material-symbols-outlined text-sm">phone_iphone</span>
              <span className="text-xs font-medium font-[family-name:var(--font-mono)] uppercase tracking-wider">
                Phone / Zalo
              </span>
            </div>
            <a
              className="font-[family-name:var(--font-mono)] text-xl md:text-2xl font-medium text-primary glow-text hover:text-white transition-colors"
              href="tel:0869290411"
            >
              0869 290 411
            </a>
          </div>
        </div>

        {/* CTA Button */}
        <button className="z-10 w-full h-14 bg-primary text-bg-dark font-[family-name:var(--font-display)] font-semibold text-lg rounded-lg btn-glow flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 mt-4">
          <span className="material-symbols-outlined font-medium">download</span>
          Download Resume
        </button>
      </div>
    </section>
  );
}
