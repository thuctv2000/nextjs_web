'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { GreetingCardEnvelope } from '@/presentation/components/features/lixi/GreetingCardEnvelope';
import { BackgroundEffects } from '@/presentation/components/features/lixi/BackgroundEffects';
import { cn } from '@/shared/utils/cn';
import { getActiveLixiConfig, submitLixiGreeting, LixiEnvelope } from '@/lib/api';

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

type Phase = 'picking' | 'revealed' | 'previewing' | 'showing-all';

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
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [showQR, setShowQR] = useState(false);
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  const doReplay = useCallback(() => {
    setPhase('showing-all');
    resetTimerRef.current = setTimeout(() => {
      setEnvelopes(generateRound(tiers));
      setSelectedIndex(null);
      setPhase('picking');
    }, 3000);
  }, [tiers]);

  const handleReplay = useCallback(() => {
    if (phase !== 'revealed') return;
    doReplay();
  }, [phase, doReplay]);

  const handleNhanLiXi = useCallback(() => {
    if (phase !== 'revealed') return;
    fileInputRef.current?.click();
  }, [phase]);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedEnvelope) return;

    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    setPreviewImage(base64);
    setPhase('previewing');
    // Reset file input so same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [selectedEnvelope]);

  const handlePreviewSubmit = useCallback(async () => {
    if (!previewImage || !selectedEnvelope) return;

    setIsUploading(true);
    try {
      await submitLixiGreeting({
        name: userName,
        amount: selectedEnvelope.amount,
        message: selectedEnvelope.message,
        image: previewImage,
      });

      setPreviewImage(null);
      setUserName('');
      doReplay();
    } catch {
      alert('Tải ảnh thất bại, vui lòng thử lại!');
    } finally {
      setIsUploading(false);
    }
  }, [previewImage, selectedEnvelope, userName, doReplay]);

  const handlePreviewCancel = useCallback(() => {
    setPreviewImage(null);
    setUserName('');
    setPhase('revealed');
  }, []);

  const handleCloseDialog = useCallback(() => {
    setEnvelopes(generateRound(tiers));
    setSelectedIndex(null);
    setPhase('picking');
  }, [tiers]);

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

          <div className="mt-3 flex items-center justify-center gap-3 flex-wrap">
            <Link
              href="/face-filter"
              className={cn(
                'inline-flex items-center gap-2 px-5 py-2 rounded-full',
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
            <button
              onClick={() => setShowQR(true)}
              className={cn(
                'inline-flex items-center gap-2 px-5 py-2 rounded-full',
                'bg-gradient-to-r from-emerald-400 to-emerald-500',
                'text-white font-semibold text-sm',
                'shadow-lg shadow-emerald-500/30',
                'hover:from-emerald-500 hover:to-emerald-600',
                'hover:-translate-y-0.5',
                'active:scale-95',
                'transition-all duration-200'
              )}
            >
              💸 Chuyển tiền
            </button>
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
                className="absolute -top-0 -right-0 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-gray-500 text-white hover:bg-gray-100 hover:text-gray-800 text-base sm:text-lg z-10 transition-all shadow-lg"
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

                {/* Golden scroll bar: NHẬN LÌ XÌ */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <button
                  onClick={handleNhanLiXi}
                  disabled={isUploading}
                  className="absolute top-[69%] left-[35%] right-[33%] flex items-center justify-center cursor-pointer hover:brightness-125 transition-all disabled:opacity-50 disabled:cursor-wait"
                >
                 <p
                    className="font-bold text-[5px] sm:text-[8px] md:text-[9px] tracking-wide"
                    style={{
                      fontFamily: 'var(--font-playfair), Georgia, serif',
                      color: '#E8B169',
                      textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                    }}
                  >
                    {isUploading ? 'ĐANG TẢI...' : 'NHẬN LÌ XÌ'}
                  </p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Preview Overlay */}
        {phase === 'previewing' && previewImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-sm bg-gradient-to-b from-red-900 to-red-950 rounded-2xl shadow-2xl border border-amber-500/30 overflow-hidden">
              {/* Header */}
              <div className="px-6 pt-6 pb-3 text-center">
                <h3
                  className="text-lg font-bold tracking-wide"
                  style={{
                    fontFamily: 'var(--font-playfair), Georgia, serif',
                    color: '#E8B169',
                  }}
                >
                  Xác nhận lì xì
                </h3>
              </div>

              {/* Preview Image */}
              <div className="px-6 flex justify-center">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="max-h-48 rounded-lg object-contain border-2 border-amber-500/40"
                />
              </div>

              {/* Name Input */}
              <div className="px-6 pt-4">
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Nhập tên của bạn"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-amber-500/30 text-amber-100 placeholder-amber-300/50 text-center text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 transition-colors"
                />
              </div>

              {/* Buttons */}
              <div className="px-6 pt-4 pb-6 flex gap-3">
                <button
                  onClick={handlePreviewCancel}
                  disabled={isUploading}
                  className="flex-1 px-4 py-3 rounded-lg border border-amber-500/30 text-amber-200 text-sm font-medium hover:bg-white/10 transition-colors disabled:opacity-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handlePreviewSubmit}
                  disabled={isUploading || !userName.trim()}
                  className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-red-900 text-sm font-bold shadow-lg hover:from-amber-400 hover:to-amber-500 transition-all disabled:opacity-50 disabled:cursor-wait"
                >
                  {isUploading ? 'Đang gửi...' : 'Gửi'}
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

      {/* QR Code Modal */}
      {showQR && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowQR(false)}
        >
          <div
            className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowQR(false)}
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-800 z-10 transition-all"
            >
              ✕
            </button>
            <Image
              src="/myQR.jpg"
              alt="QR chuyển tiền"
              width={400}
              height={600}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>
      )}
    </div>
  );
}
