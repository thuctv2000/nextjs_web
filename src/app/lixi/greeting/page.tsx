'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import { GreetingCardEnvelope } from '@/presentation/components/features/lixi/GreetingCardEnvelope';
import { BackgroundEffects } from '@/presentation/components/features/lixi/BackgroundEffects';
import { cn } from '@/shared/utils/cn';
import { getActiveLixiConfig, LixiEnvelope } from '@/lib/api';

const FALLBACK_TIERS: LixiEnvelope[] = [
  { id: 1, amount: '10.000', message: 'Năm Mới Bình An!', rate: 0.30 },
  { id: 2, amount: '20.000', message: 'Tấn Tài Tấn Lộc!', rate: 0.25 },
  { id: 3, amount: '50.000', message: 'An Khang Thịnh Vượng!', rate: 0.15 },
  { id: 4, amount: '88.000', message: 'Cung Hỷ Phát Tài!', rate: 0.10 },
  { id: 5, amount: '100.000', message: 'Phát Tài Phát Lộc!', rate: 0.08 },
  { id: 6, amount: '168.000', message: 'Lộc Vào Như Nước!', rate: 0.05 },
  { id: 7, amount: '200.000', message: 'Vạn Sự Như Ý!', rate: 0.03 },
  { id: 8, amount: '500.000', message: 'Đại Cát Đại Lợi!', rate: 0.02 },
  { id: 9, amount: '888.000', message: 'Tài Lộc Đầy Nhà!', rate: 0.01 },
  { id: 10, amount: '1.000.000', message: 'Phúc Lộc Thọ!', rate: 0.005 },
  { id: 11, amount: '66.000', message: 'Vui Vẻ Hạnh Phúc!', rate: 0.005 },
  { id: 12, amount: '30.000', message: 'Mã Đáo Thành Công!', rate: 0.005 },
];

interface EnvelopeSlot {
  amount: string;
  message: string;
}

type Phase = 'picking' | 'revealed' | 'showing-all';

function pickByRate(tiers: LixiEnvelope[]): LixiEnvelope {
  const totalWeight = tiers.reduce((sum, t) => sum + t.rate, 0);
  let random = Math.random() * totalWeight;
  for (const tier of tiers) {
    random -= tier.rate;
    if (random <= 0) return tier;
  }
  return tiers[tiers.length - 1];
}

function generateRound(tiers: LixiEnvelope[]): EnvelopeSlot[] {
  const slots: EnvelopeSlot[] = [];
  for (let i = 0; i < 12; i++) {
    const picked = pickByRate(tiers);
    slots.push({ amount: picked.amount, message: picked.message });
  }
  // Shuffle
  for (let i = slots.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [slots[i], slots[j]] = [slots[j], slots[i]];
  }
  return slots;
}

export default function GreetingPage() {
  const [tiers, setTiers] = useState<LixiEnvelope[]>(FALLBACK_TIERS);
  const [envelopes, setEnvelopes] = useState<EnvelopeSlot[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [phase, setPhase] = useState<Phase>('picking');
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch config on mount
  useEffect(() => {
    let cancelled = false;
    getActiveLixiConfig()
      .then((config) => {
        if (!cancelled && config.envelopes?.length > 0) {
          setTiers(config.envelopes);
        }
      })
      .catch(() => {
        // Use fallback tiers
      });
    return () => { cancelled = true; };
  }, []);

  // Generate initial round once tiers are set
  useEffect(() => {
    setEnvelopes(generateRound(tiers));
  }, [tiers]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  const selectedEnvelope = selectedIndex !== null ? envelopes[selectedIndex] : null;

  const handleOpenEnvelope = useCallback((index: number) => {
    if (phase !== 'picking') return;
    setSelectedIndex(index);
    setPhase('revealed');
  }, [phase]);

  const handleReplay = useCallback(() => {
    if (phase !== 'revealed') return;
    setPhase('showing-all');

    // After 3 seconds, auto-reset with new round
    resetTimerRef.current = setTimeout(() => {
      setEnvelopes(generateRound(tiers));
      setSelectedIndex(null);
      setPhase('picking');
    }, 3000);
  }, [phase, tiers]);

  const handleCloseDialog = useCallback(() => {
    // Closing the dialog just closes the popup, keeps the revealed state
    // User should click "Chơi Lại" to proceed
  }, []);

  return (
    <div className="relative h-dvh overflow-hidden">
      {/* Background effects */}
      <BackgroundEffects />

      {/* Main content */}
      <div className="relative z-10 h-dvh flex flex-col overflow-y-auto">
        {/* Header section */}
        <header className="pt-8 pb-4 text-center">
          {/* Decorative top element */}

          {/* Subtitle */}
          <p className="mt-3 text-lg sm:text-xl text-amber-200 font-medium">
            Chọn một bao lì xì để mở thiệp chúc Tết! 🎊
          </p>

          <Link
            href="/face-filter"
            className={cn(
              'mt-3 inline-flex items-center gap-2 px-5 py-2 rounded-full',
              'bg-gradient-to-r from-amber-400 to-amber-500',
              'text-red-900 font-semibold text-sm',
              'shadow-lg shadow-amber-500/30',
              'hover:from-amber-500 hover:to-amber-600',
              'hover:-translate-y-0.5',
              'active:scale-95',
              'transition-all duration-200'
            )}
          >
            📸 Face Filter Tết
          </Link>
        </header>

        {/* Envelopes grid */}
        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="grid gap-4 sm:gap-6 md:gap-8 max-w-7xl grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-6">
            {envelopes.map((envelope, index) => (
              <GreetingCardEnvelope
                key={`${phase}-${index}`}
                id={index}
                isOpened={selectedIndex === index}
                isDisabled={phase !== 'picking'}
                onOpen={handleOpenEnvelope}
                delay={index * 100}
                amount={envelope.amount}
                isRevealed={phase === 'showing-all' && selectedIndex !== index}
              />
            ))}
          </div>
        </main>

        {/* Greeting Dialog Overlay */}
        {phase === 'revealed' && selectedEnvelope && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div
              className="relative w-full max-w-[85vw] sm:max-w-md md:max-w-2xl animate-card-unfold"
              style={{ aspectRatio: '1152 / 928' }}
            >
              {/* Background image */}
              <div
                className="absolute inset-0 bg-contain bg-center bg-no-repeat"
                style={{ backgroundImage: 'url(/dialog_tet.png)' }}
              />

              {/* Close button - top right of white box */}
              <button
                onClick={handleCloseDialog}
                className="absolute top-[22%] right-[24%] w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 text-sm sm:text-base z-10 transition-colors"
              >
                ✕
              </button>

              {/* Text overlay */}
              <div className="absolute inset-0">
                {/* White box: title + message */}
                <div className="absolute top-[33%] bottom-[44%] left-[28%] right-[28%] flex flex-col items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 overflow-hidden">
                  <h2
                    className="text-[10px] sm:text-xs tracking-wide text-center font-bold italic shrink-0"
                    style={{
                      fontFamily: 'var(--font-playfair), Georgia, serif',
                      color: '#b91c1c',
                      textShadow: '0 0 10px rgba(251,191,36,0.6), 0 0 20px rgba(251,191,36,0.4), 0 0 40px rgba(251,191,36,0.2)',
                    }}
                  >
                    CHÚC MỪNG NĂM MỚI
                  </h2>
                  <p
                    className="text-center text-xs sm:text-sm md:text-lg text-red-800 leading-tight sm:leading-relaxed font-bold"
                    style={{
                      fontFamily: 'var(--font-dancing), cursive',
                    }}
                  >
                    &ldquo;{selectedEnvelope.message}&rdquo;
                  </p>
                </div>

                {/* Red dragon section: amount */}
                <div className="absolute top-[59%] left-[28%] right-[28%] flex items-center justify-center">
                  <p
                    className="font-bold text-[10px] sm:text-base md:text-lg lg:text-xl tracking-wide"
                    style={{
                      fontFamily: 'var(--font-playfair), Georgia, serif',
                      fontStyle: 'italic',
                      color: '#E8B169',
                      textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                    }}
                  >
                    {selectedEnvelope.amount}
                  </p>
                </div>

                {/* Golden scroll bar: NHẬN LÌ XÌ NGAY */}
                <button
                  onClick={handleReplay}
                  className="absolute top-[69%] left-[35%] right-[33%] flex items-center justify-center cursor-pointer hover:brightness-125 transition-all"
                >
                 <p
                    className="font-bold text-[5px] sm:text-[8px] md:text-[9px] tracking-wide"
                    style={{
                      fontFamily: 'var(--font-playfair), Georgia, serif',
                      color: '#E8B169',
                      textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                    }}
                  >
                    NHẬN LÌ XÌ
                  </p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer section */}
        <footer className="pb-8 text-center">
          {/* Replay button (shows when an envelope is opened) */}
          {phase === 'revealed' && (
            <button
              onClick={handleReplay}
              className={cn(
                'inline-flex items-center gap-2 px-6 py-3 rounded-full',
                'bg-gradient-to-r from-red-500 to-red-600',
                'text-white font-semibold text-lg',
                'shadow-lg shadow-red-500/30',
                'hover:from-red-600 hover:to-red-700',
                'hover:shadow-xl hover:shadow-red-500/40',
                'hover:-translate-y-1',
                'active:scale-95',
                'transition-all duration-300',
                'animate-fade-in'
              )}
            >
              🔄 Chơi Lại
            </button>
          )}

          {/* Showing all indicator */}
          {phase === 'showing-all' && (
            <p className="text-amber-200 text-lg font-medium animate-fade-in">
              Đang mở tất cả bao lì xì... 🎊
            </p>
          )}

          {/* Footer text */}
          <p className="mt-4 text-amber-300 text-sm">
            Chúc bạn và gia đình năm mới An Khang Thịnh Vượng! 🎉
          </p>
        </footer>
      </div>
    </div>
  );
}
