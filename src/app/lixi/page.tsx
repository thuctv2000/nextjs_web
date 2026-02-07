'use client';

import { useState, useCallback, useEffect } from 'react';
import { LuckyEnvelope } from '@/presentation/components/features/lixi/LuckyEnvelope';
import { BackgroundEffects } from '@/presentation/components/features/lixi/BackgroundEffects';
import { RewardModal } from '@/presentation/components/features/lixi/RewardModal';
import { cn } from '@/shared/utils/cn';
import { getActiveLixiConfig, LixiEnvelope } from '@/lib/api';

// Fallback rewards when API is unavailable
const FALLBACK_REWARDS: LixiEnvelope[] = [
  { id: 1, amount: '100K VNĐ', message: 'Phát Tài Phát Lộc!' },
  { id: 2, amount: '50K VNĐ', message: 'An Khang Thịnh Vượng!' },
  { id: 3, amount: '200K VNĐ', message: 'Vạn Sự Như Ý!' },
  { id: 4, amount: '20K VNĐ', message: 'Năm Mới Bình An!' },
  { id: 5, amount: '500K VNĐ', message: 'Đại Cát Đại Lợi!' },
  { id: 6, amount: '10K VNĐ', message: 'Tấn Tài Tấn Lộc!' },
  { id: 7, amount: '1 Triệu VNĐ', message: 'Phúc Lộc Thọ!' },
  { id: 8, amount: '30K VNĐ', message: 'Mã Đáo Thành Công!' },
  { id: 9, amount: '88K VNĐ', message: 'Cung Hỷ Phát Tài!' },
  { id: 10, amount: '168K VNĐ', message: 'Lộc Vào Như Nước!' },
  { id: 11, amount: '66K VNĐ', message: 'Vui Vẻ Hạnh Phúc!' },
  { id: 12, amount: '888K VNĐ', message: 'Tài Lộc Đầy Nhà!' },
];

export default function LixiPage() {
  const [rewards, setRewards] = useState<LixiEnvelope[]>(FALLBACK_REWARDS);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedReward, setSelectedReward] = useState<{
    amount: string;
    message: string;
  } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [revealAll, setRevealAll] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch config from API
  useEffect(() => {
    async function fetchConfig() {
      try {
        const config = await getActiveLixiConfig();
        if (config.envelopes && config.envelopes.length === 12) {
          setRewards(config.envelopes);
        }
      } catch (error) {
        console.warn('Using fallback rewards:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchConfig();
  }, []);

  const handleOpenEnvelope = useCallback((id: number) => {
    const reward = rewards.find((r) => r.id === id) || rewards[id - 1];
    setSelectedId(id);
    setSelectedReward(reward);
    setShowModal(true);
    // After 1.5s delay, reveal all other envelopes
    setTimeout(() => setRevealAll(true), 1500);
  }, [rewards]);

  const handleReplay = useCallback(() => {
    setSelectedId(null);
    setSelectedReward(null);
    setShowModal(false);
    setRevealAll(false);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 via-amber-50 to-red-100">
        <div className="text-center">
          <div className="animate-bounce text-6xl mb-4">🧧</div>
          <p className="text-amber-700 font-medium">Đang tải...</p>
        </div>
      </div>
    );
  }

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

          {/* Mode switcher */}
          <div className="mt-6 flex justify-center">
            <a
              href="/lixi/greeting"
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2',
                'bg-white/80 backdrop-blur-sm rounded-full',
                'border-2 border-amber-300',
                'text-amber-700 font-medium text-sm',
                'hover:bg-amber-50 hover:border-amber-400',
                'transition-all duration-300',
                'shadow-md hover:shadow-lg'
              )}
            >
              <span>📜</span>
              <span>Xem phiên bản Thiệp Chúc</span>
            </a>
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
            {rewards.map((reward, index) => (
              <LuckyEnvelope
                key={reward.id}
                id={reward.id}
                reward={reward}
                isOpened={selectedId === reward.id}
                isRevealed={revealAll && selectedId !== reward.id}
                isDisabled={selectedId !== null && selectedId !== reward.id && !revealAll}
                onOpen={handleOpenEnvelope}
                delay={index * 100}
              />
            ))}
          </div>
        </main>

        {/* Footer section */}
        <footer className="pb-8 text-center">
          {/* Replay button (shows when an envelope is opened) */}
          {selectedId !== null && (
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
