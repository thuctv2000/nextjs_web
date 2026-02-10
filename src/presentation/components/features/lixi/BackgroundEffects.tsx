'use client';

import { useEffect, useState } from 'react';

interface Lantern {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  color: 'red' | 'gold' | 'orange';
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

interface Petal {
  id: number;
  x: number;
  duration: number;
  delay: number;
  rotation: number;
}

export function BackgroundEffects() {
  const [lanterns, setLanterns] = useState<Lantern[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [petals, setPetals] = useState<Petal[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Generate lanterns
    const newLanterns: Lantern[] = [];
    for (let i = 0; i < 8; i++) {
      newLanterns.push({
        id: i,
        x: 5 + Math.random() * 90,
        size: 30 + Math.random() * 30,
        duration: 15 + Math.random() * 10,
        delay: Math.random() * 5,
        color: ['red', 'gold', 'orange'][Math.floor(Math.random() * 3)] as Lantern['color'],
      });
    }
    setLanterns(newLanterns);

    // Generate golden particles
    const newParticles: Particle[] = [];
    for (let i = 0; i < 30; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 2 + Math.random() * 4,
        duration: 3 + Math.random() * 4,
        delay: Math.random() * 3,
      });
    }
    setParticles(newParticles);

    // Generate petals
    const newPetals: Petal[] = [];
    for (let i = 0; i < 15; i++) {
      newPetals.push({
        id: i,
        x: Math.random() * 100,
        duration: 8 + Math.random() * 6,
        delay: Math.random() * 8,
        rotation: Math.random() * 360,
      });
    }
    setPetals(newPetals);
  }, []);

  const getLanternColor = (color: Lantern['color']) => {
    switch (color) {
      case 'red':
        return {
          main: 'from-red-400 via-red-500 to-red-600',
          glow: 'rgba(239, 68, 68, 0.4)',
        };
      case 'gold':
        return {
          main: 'from-amber-400 via-yellow-500 to-amber-600',
          glow: 'rgba(251, 191, 36, 0.4)',
        };
      case 'orange':
        return {
          main: 'from-orange-400 via-orange-500 to-orange-600',
          glow: 'rgba(251, 146, 60, 0.4)',
        };
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" style={{ height: '100dvh' }}>
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/background.png)' }}
      />

      {/* Floating lanterns */}
      {mounted && lanterns.map((lantern) => {
        const colors = getLanternColor(lantern.color);
        return (
          <div
            key={lantern.id}
            className="absolute animate-lantern-float"
            style={{
              left: `${lantern.x}%`,
              bottom: '-50px',
              animationDuration: `${lantern.duration}s`,
              animationDelay: `${lantern.delay}s`,
            }}
          >
            {/* Lantern glow */}
            <div
              className="absolute -inset-4 rounded-full blur-xl opacity-50"
              style={{ backgroundColor: colors.glow }}
            />

            {/* Lantern body */}
            <div
              className={`relative bg-gradient-to-b ${colors.main} rounded-full shadow-lg`}
              style={{
                width: lantern.size,
                height: lantern.size * 1.2,
              }}
            >
              {/* Top cap */}
              <div
                className="absolute -top-1 left-1/2 -translate-x-1/2 bg-amber-700 rounded-t-sm"
                style={{
                  width: lantern.size * 0.3,
                  height: lantern.size * 0.1,
                }}
              />

              {/* Horizontal lines */}
              <div className="absolute inset-x-0 top-1/4 h-px bg-amber-800/30" />
              <div className="absolute inset-x-0 top-1/2 h-px bg-amber-800/30" />
              <div className="absolute inset-x-0 top-3/4 h-px bg-amber-800/30" />

              {/* Bottom tassel */}
              <div
                className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-amber-600 rounded-b-full"
                style={{
                  width: lantern.size * 0.15,
                  height: lantern.size * 0.2,
                }}
              />

              {/* Inner glow */}
              <div className="absolute inset-2 bg-gradient-to-b from-white/40 to-transparent rounded-full" />
            </div>
          </div>
        );
      })}

      {/* Golden particles */}
      {mounted && particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 animate-particle-float"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
            boxShadow: `0 0 ${particle.size * 2}px rgba(251, 191, 36, 0.6)`,
          }}
        />
      ))}

      {/* Cherry blossom petals */}
      {mounted && petals.map((petal) => (
        <div
          key={`petal-${petal.id}`}
          className="absolute animate-petal-fall"
          style={{
            left: `${petal.x}%`,
            top: '-20px',
            animationDuration: `${petal.duration}s`,
            animationDelay: `${petal.delay}s`,
          }}
        >
          <div
            className="w-3 h-3 bg-gradient-to-br from-pink-200 to-pink-300 rounded-full opacity-70"
            style={{
              clipPath: 'ellipse(50% 35% at 50% 50%)',
              transform: `rotate(${petal.rotation}deg)`,
            }}
          />
        </div>
      ))}

      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-32 h-32 opacity-20">
        <svg viewBox="0 0 100 100" className="w-full h-full text-red-600">
          <path
            d="M0,0 Q50,0 50,50 Q50,0 100,0 L100,10 Q55,10 50,55 Q45,10 0,10 Z"
            fill="currentColor"
          />
        </svg>
      </div>
      <div className="absolute top-0 right-0 w-32 h-32 opacity-20 scale-x-[-1]">
        <svg viewBox="0 0 100 100" className="w-full h-full text-red-600">
          <path
            d="M0,0 Q50,0 50,50 Q50,0 100,0 L100,10 Q55,10 50,55 Q45,10 0,10 Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </div>
  );
}
