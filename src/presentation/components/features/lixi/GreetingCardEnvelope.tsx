'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/shared/utils/cn';

interface GreetingCardEnvelopeProps {
  id: number;
  isOpened: boolean;
  isDisabled: boolean;
  onOpen: (id: number) => void;
  delay?: number;
  amount?: string;
  isRevealed?: boolean;
}

type EnvelopeState = 'idle' | 'flipping' | 'opening' | 'revealed';

export function GreetingCardEnvelope({
  id,
  isOpened,
  isDisabled,
  onOpen,
  delay = 0,
  amount,
  isRevealed = false,
}: GreetingCardEnvelopeProps) {
  const [state, setState] = useState<EnvelopeState>(() => {
    if (isOpened || isRevealed) return 'revealed';
    return 'idle';
  });

  useEffect(() => {
    if ((isOpened || isRevealed) && state === 'idle') {
      setState('revealed');
    }
  }, [isOpened, isRevealed, state]);

  const handleClick = () => {
    if (isOpened || isDisabled || state !== 'idle') return;
    setState('flipping');
    // Flip done at 700ms, pause 200ms to see back, then crossfade to open
    setTimeout(() => setState('opening'), 900);
    // Crossfade done, reveal amount
    setTimeout(() => {
      setState('revealed');
      onOpen(id);
    }, 1400);
  };

  const isFlipped = state !== 'idle';
  const isOpen = state === 'opening' || state === 'revealed';
  const showAmount = state === 'revealed' && amount;

  return (
    <div
      className={cn(
        'relative cursor-pointer',
        'w-28 h-40 sm:w-32 sm:h-44 md:w-36 md:h-48',
        '[perspective:1000px]',
        isDisabled && state === 'idle' && 'opacity-50 cursor-not-allowed',
        state === 'revealed' && 'cursor-default'
      )}
      style={{ animationDelay: `${delay}ms` }}
      onClick={handleClick}
    >
      <div
        className={cn(
          'relative w-full h-full [transform-style:preserve-3d]',
          state === 'idle' && 'animate-float',
          (state === 'flipping' || state === 'opening') && 'transition-transform duration-700',
          isFlipped && '[transform:rotateY(180deg)]'
        )}
        style={{ animationDelay: `${delay}ms` }}
      >
        {/* Front face - lixi_font */}
        <div className="absolute inset-0 [backface-visibility:hidden]">
          <div
            className={cn(
              'absolute -inset-2 rounded-2xl opacity-0 transition-opacity duration-300',
              'bg-gradient-to-r from-yellow-400/50 via-amber-300/50 to-yellow-400/50',
              'blur-xl',
              !isDisabled && !isOpened && 'hover:opacity-100'
            )}
          />
          <div
            className={cn(
              'relative w-full h-full rounded-xl overflow-hidden',
              'transition-all duration-300',
              !isDisabled && !isOpened && 'hover:scale-105 hover:-translate-y-2'
            )}
            style={{
              backgroundImage: "url('/lixi_font.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        </div>

        {/* Back face - lixi_back → lixi_open */}
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div
            className={cn(
              'relative w-full h-full rounded-xl overflow-hidden',
              (!isOpened && isRevealed) && 'opacity-70'
            )}
          >
            {/* Back image (visible after flip, fades when opening) */}
            <div
              className={cn(
                'absolute inset-0 bg-cover bg-center transition-opacity duration-500',
                isOpen && 'opacity-0'
              )}
              style={{ backgroundImage: "url('/lixi_back.png')" }}
            />
            {/* Open image (fades in when opening) */}
            <div
              className={cn(
                'absolute inset-0 bg-cover bg-center transition-opacity duration-500',
                !isOpen && 'opacity-0'
              )}
              style={{ backgroundImage: "url('/lixi_open.png')" }}
            />

            {/* Amount overlay */}
            {showAmount && (
              <div className="absolute inset-0 flex flex-col items-center justify-start pt-[12%]">
                <div className="flex flex-col items-center gap-1 animate-reward-appear">
                  <span className="text-2xl drop-shadow-lg">{isOpened ? '🎊' : '🧧'}</span>
                  <span
                    className={cn(
                      'font-bold text-sm sm:text-base md:text-lg text-center px-1 break-words',
                      'drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]',
                      isOpened ? 'text-yellow-100' : 'text-amber-200/80'
                    )}
                    style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
                  >
                    {amount}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
