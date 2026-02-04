'use client';

import { useState, useCallback } from 'react';
import { LuckyEnvelope } from '@/presentation/components/features/lixi/LuckyEnvelope';
import { BackgroundEffects } from '@/presentation/components/features/lixi/BackgroundEffects';
import { RewardModal } from '@/presentation/components/features/lixi/RewardModal';
import { cn } from '@/shared/utils/cn';

// Reward configurations
const REWARDS = [
  { amount: '100K VNĐ', message: 'Phát Tài Phát Lộc! 💰' },
  { amount: '50K VNĐ', message: 'An Khang Thịnh Vượng! 🎊' },
  { amount: '200K VNĐ', message: 'Vạn Sự Như Ý! 🧧' },
  { amount: '20K VNĐ', message: 'Năm Mới Bình An! 🏮' },
  { amount: '500K VNĐ', message: 'Đại Cát Đại Lợi! 🐲' },
  { amount: '10K VNĐ', message: 'Tấn Tài Tấn Lộc! ✨' },
  { amount: '1 Triệu VNĐ', message: 'Phúc Lộc Thọ! 🎆' },
  { amount: '30K VNĐ', message: 'Mã Đáo Thành Công! 🐎' },
  { amount: '88K VNĐ', message: 'Cung Hỷ Phát Tài! 🎉' },
  { amount: '168K VNĐ', message: 'Lộc Vào Như Nước! 💫' },
  { amount: '66K VNĐ', message: 'Vui Vẻ Hạnh Phúc! 😊' },
  { amount: '888K VNĐ', message: 'Tài Lộc Đầy Nhà! 🏠' },
];

export default function LixiPage() {
  const [openedEnvelopes, setOpenedEnvelopes] = useState<Set<number>>(new Set());
  const [selectedReward, setSelectedReward] = useState<{
    amount: string;
    message: string;
  } | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleOpenEnvelope = useCallback((id: number) => {
    setOpenedEnvelopes((prev) => new Set([...prev, id]));
    setSelectedReward(REWARDS[id]);
    setShowModal(true);
  }, []);

  const handleReplay = useCallback(() => {
    setOpenedEnvelopes(new Set());
    setSelectedReward(null);
    setShowModal(false);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background effects */}
      <BackgroundEffects />

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col">
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
              'bg-gradient-to-r from-red-600 via-amber-500 to-red-600',
              'bg-clip-text text-transparent',
              'drop-shadow-lg',
              'animate-text-shimmer bg-[length:200%_auto]'
            )}
          >
            Lì Xì May Mắn
          </h1>

          {/* Subtitle */}
          <p className="mt-3 text-lg sm:text-xl text-amber-700 font-medium">
            Chọn một phong bao đỏ để nhận lộc đầu năm! 🧧
          </p>

          {/* Year display */}
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-red-600/10 rounded-full border border-red-200">
            <span className="text-red-600 font-bold">🐍 Năm Ất Tỵ 2025</span>
          </div>
        </header>

        {/* Envelopes grid */}
        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <div
            className={cn(
              'grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-6',
              'gap-4 sm:gap-6 md:gap-8',
              'max-w-5xl'
            )}
          >
            {REWARDS.map((reward, index) => (
              <LuckyEnvelope
                key={index}
                id={index}
                reward={reward}
                isOpened={openedEnvelopes.has(index)}
                isDisabled={openedEnvelopes.size > 0 && !openedEnvelopes.has(index)}
                onOpen={handleOpenEnvelope}
                delay={index * 100}
              />
            ))}
          </div>
        </main>

        {/* Footer section */}
        <footer className="pb-8 text-center">
          {/* Replay button (shows when at least one envelope is opened) */}
          {openedEnvelopes.size > 0 && (
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
          <p className="mt-4 text-amber-600 text-sm">
            Chúc bạn và gia đình năm mới An Khang Thịnh Vượng! 🎉
          </p>
        </footer>
      </div>

      {/* Reward modal */}
      <RewardModal
        isOpen={showModal}
        reward={selectedReward}
        onClose={handleCloseModal}
        onReplay={handleReplay}
      />
    </div>
  );
}
