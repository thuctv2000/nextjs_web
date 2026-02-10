'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/shared/utils/cn';
import { Confetti, Fireworks } from './Confetti';

interface RewardModalProps {
  isOpen: boolean;
  reward: {
    amount: string;
    message: string;
  } | null;
  onClose: () => void;
  onReplay: () => void;
}

export function RewardModal({ isOpen, reward, onClose, onReplay }: RewardModalProps) {
  const [showEffects, setShowEffects] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowEffects(true);
      const timer = setTimeout(() => setShowEffects(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen || !reward) return null;

  return (
    <>
      <Confetti isActive={showEffects} particleCount={80} />
      <Fireworks isActive={showEffects} />

      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in"
        style={{ height: '100dvh' }}
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ height: '100dvh' }}>
        <div
          className={cn(
            'relative w-full max-w-sm',
            'bg-gradient-to-b from-amber-50 via-yellow-50 to-amber-100',
            'rounded-3xl shadow-2xl',
            'border-4 border-amber-400',
            'overflow-hidden',
            'animate-modal-appear'
          )}
        >
          {/* Decorative top banner */}
          <div className="relative h-20 bg-gradient-to-r from-red-500 via-red-600 to-red-500 overflow-hidden">
            {/* Pattern overlay */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 10px,
                  rgba(255,255,255,0.1) 10px,
                  rgba(255,255,255,0.1) 20px
                )`,
              }}
            />

            {/* Golden dragons/decorations */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-4xl animate-bounce-slow">🧧</div>
            </div>

            {/* Bottom wave */}
            <div className="absolute -bottom-1 left-0 right-0">
              <svg viewBox="0 0 400 20" className="w-full h-5 text-amber-50">
                <path
                  d="M0,20 Q100,0 200,10 T400,20 L400,20 L0,20 Z"
                  fill="currentColor"
                />
              </svg>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 pt-4 text-center">
            {/* Congratulations text */}
            <h2 className="text-2xl font-bold text-red-600 mb-2 animate-pulse-slow">
              🎊 Chúc Mừng! 🎊
            </h2>

            <p className="text-amber-700 mb-6">Bạn đã nhận được lì xì may mắn!</p>

            {/* Reward display */}
            <div className="relative py-6 mb-6">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-300/30 to-transparent animate-shimmer" />

              {/* Amount */}
              <div className="relative">
                <div className="text-5xl font-bold bg-gradient-to-r from-red-500 via-amber-500 to-red-500 bg-clip-text text-transparent animate-text-shimmer">
                  {reward.amount}
                </div>
                <div className="mt-2 text-amber-600 font-medium">{reward.message}</div>
              </div>

              {/* Decorative sparkles */}
              <div className="absolute top-0 left-1/4 text-2xl animate-sparkle">✨</div>
              <div
                className="absolute bottom-0 right-1/4 text-2xl animate-sparkle"
                style={{ animationDelay: '0.3s' }}
              >
                ✨
              </div>
            </div>

            {/* Lucky wishes */}
            <div className="flex justify-center gap-3 mb-6 text-2xl">
              {['🧧', '🏮', '🎆', '🧨', '🎊'].map((emoji, i) => (
                <span
                  key={i}
                  className="animate-bounce"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {emoji}
                </span>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={onReplay}
                className={cn(
                  'flex-1 py-3 px-4 rounded-xl',
                  'bg-gradient-to-r from-red-500 to-red-600',
                  'text-white font-semibold',
                  'shadow-lg shadow-red-500/30',
                  'hover:from-red-600 hover:to-red-700',
                  'active:scale-95',
                  'transition-all duration-200'
                )}
              >
                🔄 Chơi lại
              </button>
              <button
                onClick={onClose}
                className={cn(
                  'flex-1 py-3 px-4 rounded-xl',
                  'bg-gradient-to-r from-amber-400 to-amber-500',
                  'text-amber-900 font-semibold',
                  'shadow-lg shadow-amber-400/30',
                  'hover:from-amber-500 hover:to-amber-600',
                  'active:scale-95',
                  'transition-all duration-200'
                )}
              >
                Đóng
              </button>
            </div>

            {/* Share section */}
            <div className="mt-4 pt-4 border-t border-amber-200">
              <p className="text-sm text-amber-600 mb-2">Chia sẻ may mắn của bạn!</p>
              <div className="flex justify-center gap-2">
                {['📱', '💬', '📧'].map((icon, i) => (
                  <button
                    key={i}
                    className={cn(
                      'w-10 h-10 rounded-full',
                      'bg-white shadow-md',
                      'flex items-center justify-center',
                      'hover:scale-110 hover:shadow-lg',
                      'transition-all duration-200'
                    )}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Decorative corner elements */}
          <div className="absolute top-16 left-2 text-amber-300 text-xl opacity-50">❀</div>
          <div className="absolute top-20 right-3 text-amber-300 text-lg opacity-50">❀</div>
        </div>
      </div>
    </>
  );
}
