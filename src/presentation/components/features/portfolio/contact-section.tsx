'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { profile } from '@/lib/portfolio-data';

gsap.registerPlugin(ScrollTrigger);

export function ContactSection() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current!;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        root.querySelectorAll('h2 .line > span'),
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1,
          ease: 'power4.out',
          stagger: 0.1,
          scrollTrigger: { trigger: root, start: 'top 60%' },
        }
      );
      gsap.fromTo(
        root.querySelectorAll('.contact-email, .contact-meta'),
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.15,
          scrollTrigger: { trigger: root, start: 'top 45%' },
        }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="contact" className="contact" ref={rootRef}>
      <div className="glow" />
      <span className="label" style={{ color: 'var(--pf-color-grey-brown)' }}>
        GENERAL ENQUIRIES · REPLIES WITHIN 24H
      </span>
      <h2 style={{ marginTop: '3vh' }}>
        <span className="line">
          <span>You caught me shipping</span>
        </span>
        <span className="line">
          <span>
            <em>real products.</em> Imagine what
          </span>
        </span>
        <span className="line">
          <span>I can build for your team.</span>
        </span>
      </h2>

      <a href={`mailto:${profile.email}`} className="contact-email" data-hover>
        {profile.email}
      </a>

      <div className="contact-meta">
        <div className="cell">
          <span className="k label">PHONE</span>
          <a href="tel:0869290411" className="v">
            {profile.phone}
          </a>
        </div>
        <div className="cell">
          <span className="k label">SOCIAL</span>
          <a href={profile.facebookUrl} target="_blank" rel="noreferrer" className="v">
            {profile.facebook}
          </a>
        </div>
        <div className="cell">
          <span className="k label">LOCATION</span>
          <span className="v">{profile.address}</span>
        </div>
        <div className="cell">
          <span className="k label">EDUCATION</span>
          <span className="v">
            {profile.education.school} — {profile.education.major},{' '}
            {profile.education.period}
          </span>
        </div>
      </div>

      <div className="site-footer-row label">
        <span>© {new Date().getFullYear()} TRAN VAN THUC</span>
        <span>DESIGN DNA · ORYZO.AI (LUSION) — REBUILT WITH ADMIRATION</span>
        <span>HCMC · VN</span>
      </div>
    </section>
  );
}
