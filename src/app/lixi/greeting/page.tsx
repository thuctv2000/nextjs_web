'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { GreetingCardEnvelope } from '@/presentation/components/features/lixi/GreetingCardEnvelope';
import { BackgroundEffects } from '@/presentation/components/features/lixi/BackgroundEffects';
import { cn } from '@/shared/utils/cn';
import { getActiveLixiConfig, LixiEnvelope } from '@/lib/api';

const FALLBACK_TIERS: LixiEnvelope[] = [
  { id: 1, amount: '10K VNĐ', message: 'Năm Mới Bình An!', rate: 0.30 },
  { id: 2, amount: '20K VNĐ', message: 'Tấn Tài Tấn Lộc!', rate: 0.25 },
  { id: 3, amount: '50K VNĐ', message: 'An Khang Thịnh Vượng!', rate: 0.15 },
  { id: 4, amount: '88K VNĐ', message: 'Cung Hỷ Phát Tài!', rate: 0.10 },
  { id: 5, amount: '100K VNĐ', message: 'Phát Tài Phát Lộc!', rate: 0.08 },
  { id: 6, amount: '168K VNĐ', message: 'Lộc Vào Như Nước!', rate: 0.05 },
  { id: 7, amount: '200K VNĐ', message: 'Vạn Sự Như Ý!', rate: 0.03 },
  { id: 8, amount: '500K VNĐ', message: 'Đại Cát Đại Lợi!', rate: 0.02 },
  { id: 9, amount: '888K VNĐ', message: 'Tài Lộc Đầy Nhà!', rate: 0.01 },
  { id: 10, amount: '1 Triệu VNĐ', message: 'Phúc Lộc Thọ!', rate: 0.005 },
  { id: 11, amount: '66K VNĐ', message: 'Vui Vẻ Hạnh Phúc!', rate: 0.005 },
  { id: 12, amount: '30K VNĐ', message: 'Mã Đáo Thành Công!', rate: 0.005 },
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
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-2">
              <span className="text-3xl animate-bounce-slow">🏮</span>
              <span className="text-3xl animate-bounce-slow" style={{ animationDelay: '0.2s' }}>
                🧧
              </span>
              <span className="text-3xl animate-bounce-slow" style={{ animationDelay: '0.4s' }}>
                🏮
              </span>
            </div>
          </div>

          {/* Main title */}
          <h1
            className={cn(
              'text-4xl sm:text-5xl md:text-6xl font-bold',
              'bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300',
              'bg-clip-text text-transparent',
              'drop-shadow-lg',
              'animate-text-shimmer bg-[length:200%_auto]'
            )}
          >
            Thiệp Chúc Tết May Mắn
          </h1>

          {/* Subtitle */}
          <p className="mt-3 text-lg sm:text-xl text-amber-200 font-medium">
            Chọn một bao lì xì để mở thiệp chúc Tết! 🎊
          </p>

          {/* Year display */}
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-amber-900/40 rounded-full border border-amber-400/50">
            <span className="text-amber-300 font-bold">🐍 Năm Ất Tỵ 2025</span>
          </div>

          {/* Mode switcher */}
          <div className="mt-6 flex justify-center">
            <a
              href="/lixi"
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2',
                'bg-amber-900/40 backdrop-blur-sm rounded-full',
                'border-2 border-amber-400/50',
                'text-amber-200 font-medium text-sm',
                'hover:bg-amber-900/60 hover:border-amber-300',
                'transition-all duration-300',
                'shadow-md hover:shadow-lg'
              )}
            >
              <span>🧧</span>
              <span>Xem phiên bản Lì Xì thông thường</span>
            </a>
          </div>
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div
              className="relative w-full max-w-2xl animate-card-unfold"
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
                className="absolute top-[21%] right-[25%] w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 text-sm sm:text-base z-10 transition-colors"
              >
                ✕
              </button>

              {/* Text overlay */}
              <div className="absolute inset-0">
                {/* White box: title + message */}
                <div className="absolute top-[33%] bottom-[44%] left-[28%] right-[28%] flex flex-col items-center justify-center gap-2 sm:gap-4 px-4">
                  <h2
                    className="text-xs tracking-wide text-center font-bold italic"
                    style={{
                      fontFamily: 'var(--font-playfair), Georgia, serif',
                      color: '#b91c1c',
                      textShadow: '0 0 10px rgba(251,191,36,0.6), 0 0 20px rgba(251,191,36,0.4), 0 0 40px rgba(251,191,36,0.2)',
                    }}
                  >
                    CHÚC MỪNG NĂM MỚI
                  </h2>
                  <p
                    className="text-center text-sm sm:text-base md:text-lg text-red-800 leading-relaxed font-bold"
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
                    className="font-bold text-base sm:text-base md:text-lg lg:text-xl tracking-wide"
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
                    className="font-bold text-[7px] sm:text-[9px] md:text-[9px] tracking-wide"
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

          {/* Lucky message */}
          <div className="mt-6 flex justify-center gap-4 text-2xl">
            {['🎊', '🧧', '🎆', '🧨', '🎊'].map((emoji, i) => (
              <span
                key={i}
                className="animate-float"
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                {emoji}
              </span>
            ))}
          </div>

          {/* Footer text */}
          <p className="mt-4 text-amber-300 text-sm">
            Chúc bạn và gia đình năm mới An Khang Thịnh Vượng! 🎉
          </p>
        </footer>
      </div>
    </div>
  );
}
