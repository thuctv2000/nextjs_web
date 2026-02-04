'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/shared/utils/cn';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
  type: 'confetti' | 'sparkle' | 'star';
  delay: number;
  duration: number;
}

interface ConfettiProps {
  isActive: boolean;
  particleCount?: number;
}

const COLORS = [
  '#FFD700', // Gold
  '#FFA500', // Orange
  '#FF6B6B', // Red
  '#FF4757', // Crimson
  '#FFEAA7', // Light yellow
  '#FF7675', // Light red
  '#E17055', // Coral
  '#FDCB6E', // Mustard
];

export function Confetti({ isActive, particleCount = 60 }: ConfettiProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (isActive) {
      const newParticles: Particle[] = [];
      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: -10 - Math.random() * 20,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          size: 6 + Math.random() * 8,
          rotation: Math.random() * 360,
          type: ['confetti', 'sparkle', 'star'][
            Math.floor(Math.random() * 3)
          ] as Particle['type'],
          delay: Math.random() * 0.5,
          duration: 2 + Math.random() * 2,
        });
      }
      setParticles(newParticles);

      // Clear particles after animation
      const timer = setTimeout(() => {
        setParticles([]);
      }, 5000);

      return () => clearTimeout(timer);
    } else {
      setParticles([]);
    }
  }, [isActive, particleCount]);

  if (!isActive || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={cn(
            'absolute animate-confetti-fall',
            particle.type === 'star' && 'animate-spin-slow'
          )}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        >
          {particle.type === 'confetti' && (
            <div
              className="rounded-sm animate-confetti-rotate"
              style={{
                width: particle.size,
                height: particle.size * 0.6,
                backgroundColor: particle.color,
                transform: `rotate(${particle.rotation}deg)`,
              }}
            />
          )}
          {particle.type === 'sparkle' && (
            <div
              className="rounded-full animate-pulse-fast"
              style={{
                width: particle.size * 0.8,
                height: particle.size * 0.8,
                backgroundColor: particle.color,
                boxShadow: `0 0 ${particle.size}px ${particle.color}`,
              }}
            />
          )}
          {particle.type === 'star' && (
            <svg
              width={particle.size}
              height={particle.size}
              viewBox="0 0 24 24"
              fill={particle.color}
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}

// Fireworks component
interface FireworkProps {
  isActive: boolean;
}

interface FireworkParticle {
  id: number;
  x: number;
  y: number;
  color: string;
  angle: number;
  speed: number;
}

export function Fireworks({ isActive }: FireworkProps) {
  const [fireworks, setFireworks] = useState<
    { id: number; x: number; y: number; particles: FireworkParticle[] }[]
  >([]);

  useEffect(() => {
    if (isActive) {
      const createFirework = (id: number) => {
        const x = 20 + Math.random() * 60;
        const y = 20 + Math.random() * 40;
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        const particles: FireworkParticle[] = [];

        for (let i = 0; i < 12; i++) {
          particles.push({
            id: i,
            x: 0,
            y: 0,
            color,
            angle: (i * 30 * Math.PI) / 180,
            speed: 30 + Math.random() * 20,
          });
        }

        return { id, x, y, particles };
      };

      const fw1 = createFirework(1);
      const fw2 = createFirework(2);
      const fw3 = createFirework(3);

      setFireworks([fw1]);
      setTimeout(() => setFireworks((prev) => [...prev, fw2]), 300);
      setTimeout(() => setFireworks((prev) => [...prev, fw3]), 600);

      const timer = setTimeout(() => {
        setFireworks([]);
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      setFireworks([]);
    }
  }, [isActive]);

  if (!isActive || fireworks.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {fireworks.map((fw) => (
        <div
          key={fw.id}
          className="absolute"
          style={{ left: `${fw.x}%`, top: `${fw.y}%` }}
        >
          {fw.particles.map((p) => (
            <div
              key={p.id}
              className="absolute w-2 h-2 rounded-full animate-firework-burst"
              style={{
                backgroundColor: p.color,
                boxShadow: `0 0 6px ${p.color}, 0 0 12px ${p.color}`,
                '--burst-x': `${Math.cos(p.angle) * p.speed}px`,
                '--burst-y': `${Math.sin(p.angle) * p.speed}px`,
              } as React.CSSProperties}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
