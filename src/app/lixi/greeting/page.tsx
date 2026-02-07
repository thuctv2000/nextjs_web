'use client';

import { useState, useCallback } from 'react';
import { GreetingCardEnvelope } from '@/presentation/components/features/lixi/GreetingCardEnvelope';
import { BackgroundEffects } from '@/presentation/components/features/lixi/BackgroundEffects';
import { cn } from '@/shared/utils/cn';

// Sample greeting messages for Tet
const GREETING_CARDS = [
  {
    id: 1,
    title: 'CHÚC MỪNG NĂM MỚI',
    message: 'Mong rằng năm mới sẽ mở ra cho bạn những cánh cửa lớn lành, nơi sự nỗ lực được đáp lại bằng thành công rực rờ.',
    amount: '100K VNĐ',
  },
  {
    id: 2,
    title: 'PHÁT TÀI PHÁT LỘC',
    message: 'Chúc gia đình bạn luôn hạnh phúc, ấm no, tràn đầy tiếng cười và yêu thương trong năm mới.',
    amount: '200K VNĐ',
  },
  {
    id: 3,
    title: 'VẠN SỰ NHƯ Ý',
    message: 'Năm mới chúc bạn sức khỏe dồi dào, công việc thuận lợi, gia đình hạnh phúc và tài lộc đầy nhà.',
    amount: '500K VNĐ',
  },
  {
    id: 4,
    title: 'AN KHANG THỊNH VƯỢNG',
    message: 'Chúc năm mới bình an, mọi điều tốt đẹp sẽ đến với bạn và những người thân yêu.',
    amount: '50K VNĐ',
  },
  {
    id: 5,
    title: 'ĐẠI CÁT ĐẠI LỢI',
    message: 'Năm mới hạnh phúc, may mắn và thành công. Mọi ước mơ của bạn đều sẽ thành hiện thực.',
    amount: '1,000K VNĐ',
  },
  {
    id: 6,
    title: 'PHÚC LỘC THỌ',
    message: 'Chúc bạn một năm mới tràn đầy năng lượng tích cực, gặp nhiều may mắn và niềm vui.',
    amount: '88K VNĐ',
  },
  {
    id: 7,
    title: 'TÀI LỘC ĐẦY NHÀ',
    message: 'Mong rằng năm mới sẽ mang đến cho bạn nhiều cơ hội mới, thành công mới và niềm vui mới.',
    amount: '888k VNĐ',
  },
  {
    id: 8,
    title: 'CUNG HỶ PHÁT TÀI',
    message: 'Chúc bạn và gia đình một năm mới tràn đầy sức khỏe, tài lộc và niềm vui.',
    amount: '168k VNĐ',
  },
  {
    id: 9,
    title: 'MÃ ĐÁO THÀNH CÔNG',
    message: 'Năm mới chúc bạn luôn giữ được tinh thần lạc quan, vượt qua mọi khó khăn và đạt được thành công rực rỡ.',
    amount: '66k VNĐ',
  },
  {
    id: 10,
    title: 'TẤN TÀI TẤN LỘC',
    message: 'Chúc mừng năm mới! Hy vọng năm nới sẽ mang lại cho bạn vô vàn niềm vui và thành công.',
    amount: '128K VNĐ',
  },
  {
    id: 11,
    title: 'BÌNH AN VUI VẺ',
    message: 'Chúc bạn một năm mới an lành, hạnh phúc bên gia đình và những người thân yêu.',
    amount: '38K VNĐ',
  },
  {
    id: 12,
    title: 'LỘC VÀO NHƯ NƯỚC',
    message: 'Năm mới nhiều tài lộc, công việc hanh thông, gia đạo yên vui và mọi sự như ý.',
    amount: '999K VNĐ',
  },
];

export default function GreetingPage() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [revealAll, setRevealAll] = useState(false);

  const handleOpenEnvelope = useCallback((id: number) => {
    setSelectedId(id);
    // After 2.5s delay (after bi-fold and card unfolds), reveal all other cards
    setTimeout(() => setRevealAll(true), 2500);
  }, []);

  const handleReplay = useCallback(() => {
    setSelectedId(null);
    setRevealAll(false);
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
            Thiệp Chúc Tết May Mắn
          </h1>

          {/* Subtitle */}
          <p className="mt-3 text-lg sm:text-xl text-amber-700 font-medium">
            Chọn một bao lì xì để mở thiệp chúc Tết! 🎊
          </p>

          {/* Year display */}
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-red-600/10 rounded-full border border-red-200">
            <span className="text-red-600 font-bold">🐍 Năm Ất Tỵ 2025</span>
          </div>

          {/* Mode switcher */}
          <div className="mt-6 flex justify-center">
            <a
              href="/lixi"
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
              <span>🧧</span>
              <span>Xem phiên bản Lì Xì thông thường</span>
            </a>
          </div>
        </header>

        {/* Envelopes grid */}
        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="grid gap-4 sm:gap-6 md:gap-8 max-w-7xl grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-6">
            {GREETING_CARDS.map((card, index) => (
              <GreetingCardEnvelope
                key={card.id}
                id={card.id}
                isOpened={selectedId === card.id}
                isDisabled={selectedId !== null}
                onOpen={handleOpenEnvelope}
                delay={index * 100}
              />
            ))}
          </div>
        </main>

        {/* Greeting Dialog Overlay */}
        {selectedId !== null && (
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
                onClick={handleReplay}
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
                    {GREETING_CARDS.find((c) => c.id === selectedId)?.title}
                  </h2>
                  <p
                    className="text-center text-sm sm:text-base md:text-lg text-red-800 leading-relaxed font-bold"
                    style={{
                      fontFamily: 'var(--font-dancing), cursive',
                    }}
                  >
                    &ldquo;{GREETING_CARDS.find((c) => c.id === selectedId)?.message}&rdquo;
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
                    {GREETING_CARDS.find((c) => c.id === selectedId)?.amount}
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
    </div>
  );
}
