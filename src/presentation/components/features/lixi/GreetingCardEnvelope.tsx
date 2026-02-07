'use client';

import { useState } from 'react';
import { cn } from '@/shared/utils/cn';

interface GreetingCardEnvelopeProps {
  id: number;
  isOpened: boolean;
  isDisabled: boolean;
  onOpen: (id: number) => void;
  delay?: number;
}

export function GreetingCardEnvelope({
  id,
  isOpened,
  isDisabled,
  onOpen,
  delay = 0,
}: GreetingCardEnvelopeProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (isOpened || isDisabled || isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      onOpen(id);
    }, 1900);
  };

  return (
    <div
      className={cn(
        'relative transition-all duration-500',
        'w-28 h-40 sm:w-32 sm:h-44 md:w-36 md:h-48',
        !isDisabled && !isOpened && 'cursor-pointer',
        (isDisabled || isOpened) && 'cursor-default'
      )}
      style={{ animationDelay: `${delay}ms` }}
      onClick={handleClick}
    >
      {/* Envelope */}
      <div
        className={cn(
          'relative w-full h-full transform-gpu',
          'animate-float'
        )}
        style={{
          animationDelay: `${delay}ms`,
          perspective: '1200px',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Glow effect on hover */}
        <div
          className={cn(
            'absolute -inset-2 rounded-lg opacity-0 transition-opacity duration-300',
            'bg-gradient-to-r from-yellow-400/50 via-amber-300/50 to-yellow-400/50',
            'blur-xl',
            !isDisabled && !isOpened && 'hover:opacity-100'
          )}
        />

        {/* Bi-fold envelope - Left panel */}
        <div
          className={cn(
            'absolute top-0 left-0 w-1/2 h-full',
            'origin-right',
            'transition-all duration-1000',
            isAnimating && 'animate-bifold-left'
          )}
          style={{
            transformStyle: 'preserve-3d',
          }}
        >
          <div
            className={cn(
              'w-full h-full rounded-l-lg overflow-hidden',
              'bg-gradient-to-br from-red-500 via-red-600 to-red-700',
              'shadow-lg shadow-red-500/30',
              'border-2 border-r-0 border-amber-400/50',
              'transition-all duration-300',
              !isDisabled && !isOpened && 'hover:shadow-2xl hover:shadow-amber-400/40'
            )}
          >
            {/* Decorative patterns */}
            <div className="absolute inset-0 opacity-20">
              {/* Flower patterns */}
              <div className="absolute top-4 left-2 w-6 h-6">
                <svg viewBox="0 0 24 24" fill="currentColor" className="text-amber-400">
                  <circle cx="12" cy="12" r="3" />
                  <circle cx="12" cy="6" r="2" />
                  <circle cx="12" cy="18" r="2" />
                  <circle cx="6" cy="12" r="2" />
                  <circle cx="18" cy="12" r="2" />
                </svg>
              </div>
              <div className="absolute bottom-8 left-4 w-8 h-8">
                <svg viewBox="0 0 24 24" fill="currentColor" className="text-amber-400">
                  <circle cx="12" cy="12" r="3" />
                  <circle cx="12" cy="6" r="2" />
                  <circle cx="12" cy="18" r="2" />
                  <circle cx="6" cy="12" r="2" />
                  <circle cx="18" cy="12" r="2" />
                </svg>
              </div>
            </div>

            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Bi-fold envelope - Right panel */}
        <div
          className={cn(
            'absolute top-0 right-0 w-1/2 h-full',
            'origin-left',
            'transition-all duration-1000',
            isAnimating && 'animate-bifold-right'
          )}
          style={{
            transformStyle: 'preserve-3d',
          }}
        >
          <div
            className={cn(
              'w-full h-full rounded-r-lg overflow-hidden',
              'bg-gradient-to-br from-red-500 via-red-600 to-red-700',
              'shadow-lg shadow-red-500/30',
              'border-2 border-l-0 border-amber-400/50',
              'transition-all duration-300',
              !isDisabled && !isOpened && 'hover:shadow-2xl hover:shadow-amber-400/40'
            )}
          >
            {/* Center decoration - Loc character with flowers */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              {/* Flower petals background */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 relative">
                  {/* 5 petals forming a flower */}
                  {[0, 72, 144, 216, 288].map((angle, i) => (
                    <div
                      key={i}
                      className="absolute top-1/2 left-1/2 w-8 h-12 -translate-x-1/2 origin-bottom"
                      style={{
                        transform: `rotate(${angle}deg) translateY(-50%)`,
                      }}
                    >
                      <div className="w-full h-full bg-gradient-to-t from-amber-400 to-amber-300 rounded-full opacity-80" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Center circle with Loc character */}
              <div
                className={cn(
                  'relative w-12 h-12 sm:w-14 sm:h-14',
                  'rounded-full',
                  'bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600',
                  'flex items-center justify-center',
                  'shadow-lg shadow-amber-500/50',
                  'border-2 border-amber-300',
                  'z-10'
                )}
              >
                <span className="text-red-700 text-xl sm:text-2xl font-bold" style={{ fontFamily: 'serif' }}>
                  Lộc
                </span>
              </div>
            </div>

            {/* Decorative patterns */}
            <div className="absolute inset-0 opacity-20">
              {/* Flower patterns */}
              <div className="absolute top-6 right-2 w-6 h-6">
                <svg viewBox="0 0 24 24" fill="currentColor" className="text-amber-400">
                  <circle cx="12" cy="12" r="3" />
                  <circle cx="12" cy="6" r="2" />
                  <circle cx="12" cy="18" r="2" />
                  <circle cx="6" cy="12" r="2" />
                  <circle cx="18" cy="12" r="2" />
                </svg>
              </div>
              <div className="absolute bottom-12 right-3 w-8 h-8">
                <svg viewBox="0 0 24 24" fill="currentColor" className="text-amber-400">
                  <circle cx="12" cy="12" r="3" />
                  <circle cx="12" cy="6" r="2" />
                  <circle cx="12" cy="18" r="2" />
                  <circle cx="6" cy="12" r="2" />
                  <circle cx="18" cy="12" r="2" />
                </svg>
              </div>
              <div className="absolute top-1/3 right-4 w-5 h-5">
                <svg viewBox="0 0 24 24" fill="currentColor" className="text-amber-400">
                  <circle cx="12" cy="12" r="3" />
                  <circle cx="12" cy="6" r="2" />
                  <circle cx="12" cy="18" r="2" />
                  <circle cx="6" cy="12" r="2" />
                  <circle cx="18" cy="12" r="2" />
                </svg>
              </div>
            </div>

            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />

            {/* Sparkles */}
            <div className="absolute top-8 right-6 w-1.5 h-1.5 bg-amber-200 rounded-full animate-sparkle opacity-70" />
            <div
              className="absolute bottom-16 right-8 w-1 h-1 bg-yellow-300 rounded-full animate-sparkle opacity-60"
              style={{ animationDelay: '0.5s' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
