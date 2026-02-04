'use client';

import { useState } from 'react';
import { cn } from '@/shared/utils/cn';

interface LuckyEnvelopeProps {
  id: number;
  reward: {
    amount: string;
    message: string;
  };
  isOpened: boolean;
  isRevealed?: boolean;
  isDisabled: boolean;
  onOpen: (id: number) => void;
  delay?: number;
}

export function LuckyEnvelope({
  id,
  reward,
  isOpened,
  isRevealed = false,
  isDisabled,
  onOpen,
  delay = 0,
}: LuckyEnvelopeProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (isOpened || isDisabled || isAnimating || isRevealed) return;
    setIsAnimating(true);
    setTimeout(() => {
      onOpen(id);
    }, 600);
  };

  // Show revealed state (other envelopes after one is opened)
  const showReward = isOpened || isRevealed;

  return (
    <div
      className={cn(
        'relative cursor-pointer transition-all duration-300',
        'w-28 h-40 sm:w-32 sm:h-44 md:w-36 md:h-48',
        isDisabled && !isOpened && !isRevealed && 'opacity-50 cursor-not-allowed',
        (isOpened || isRevealed) && 'cursor-default'
      )}
      style={{ animationDelay: `${delay}ms` }}
      onClick={handleClick}
    >
      {/* Envelope container */}
      <div
        className={cn(
          'relative w-full h-full transform-gpu',
          'animate-float',
          isAnimating && 'animate-envelope-open',
          showReward && 'opacity-0 scale-0'
        )}
        style={{ animationDelay: `${delay}ms` }}
      >
        {/* Glow effect on hover */}
        <div
          className={cn(
            'absolute -inset-2 rounded-2xl opacity-0 transition-opacity duration-300',
            'bg-gradient-to-r from-yellow-400/50 via-amber-300/50 to-yellow-400/50',
            'blur-xl group-hover:opacity-100',
            !isDisabled && !isOpened && !isRevealed && 'hover:opacity-100'
          )}
        />

        {/* Main envelope body */}
        <div
          className={cn(
            'relative w-full h-full rounded-xl overflow-hidden',
            'bg-gradient-to-br from-red-500 via-red-600 to-red-700',
            'shadow-lg shadow-red-500/30',
            'border-2 border-amber-400/50',
            'transition-all duration-300',
            !isDisabled &&
              !isOpened &&
              !isRevealed &&
              'hover:shadow-2xl hover:shadow-amber-400/40 hover:scale-105 hover:-translate-y-2'
          )}
        >
          {/* Gold trim top */}
          <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-amber-400 via-yellow-500 to-amber-600">
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.3)_50%,transparent_100%)]" />
          </div>

          {/* Envelope flap (triangular top) */}
          <div
            className={cn(
              'absolute top-6 left-1/2 -translate-x-1/2 w-0 h-0',
              'border-l-[3.5rem] border-r-[3.5rem] border-t-[2.5rem]',
              'sm:border-l-[4rem] sm:border-r-[4rem] sm:border-t-[3rem]',
              'border-l-transparent border-r-transparent',
              'border-t-amber-500',
              'transition-transform duration-500',
              isAnimating && 'animate-flap-open'
            )}
          >
            <div className="absolute -top-[2.5rem] left-1/2 -translate-x-1/2 w-full h-full">
              <div className="absolute inset-0 bg-gradient-to-b from-amber-400 to-amber-600 opacity-50" />
            </div>
          </div>

          {/* Center decoration - Fu character */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-2">
            <div
              className={cn(
                'w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18',
                'rounded-full',
                'bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600',
                'flex items-center justify-center',
                'shadow-lg shadow-amber-500/50',
                'border-2 border-amber-300'
              )}
            >
              <span className="text-red-700 text-2xl sm:text-3xl font-bold">福</span>
            </div>
          </div>

          {/* Bottom decoration */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-amber-400/80"
                />
              ))}
            </div>
          </div>

          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />

          {/* Sparkle effects */}
          <div className="absolute top-4 right-3 w-2 h-2 bg-white rounded-full animate-sparkle opacity-70" />
          <div
            className="absolute bottom-8 left-4 w-1.5 h-1.5 bg-amber-200 rounded-full animate-sparkle opacity-60"
            style={{ animationDelay: '0.5s' }}
          />
          <div
            className="absolute top-16 right-5 w-1 h-1 bg-yellow-200 rounded-full animate-sparkle opacity-50"
            style={{ animationDelay: '1s' }}
          />
        </div>
      </div>

      {/* Reward revealed state */}
      {showReward && (
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center',
            'animate-reward-appear'
          )}
        >
          <div
            className={cn(
              'w-full h-full rounded-xl',
              'flex flex-col items-center justify-center gap-2 p-3',
              'text-center',
              // Selected envelope: bright and highlighted
              isOpened && 'bg-gradient-to-br from-amber-100 via-yellow-50 to-amber-100 border-2 border-amber-400 shadow-lg shadow-amber-300/50',
              // Revealed envelopes: more muted style
              isRevealed && 'bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 border border-gray-300 shadow-md shadow-gray-200/50 opacity-80'
            )}
          >
            <span className="text-2xl">{isOpened ? '🎊' : '🧧'}</span>
            <span className={cn(
              'font-bold text-sm sm:text-base',
              isOpened ? 'text-red-600' : 'text-gray-600'
            )}>
              {reward.amount}
            </span>
            <span className={cn(
              'text-xs',
              isOpened ? 'text-amber-700' : 'text-gray-500'
            )}>
              {reward.message}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
