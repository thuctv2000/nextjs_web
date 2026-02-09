'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/shared/utils/cn';

const YOUTUBE_VIDEO_ID = 'A-7t7DrKHsc';

interface YTPlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  mute: () => void;
  unMute: () => void;
  setVolume: (volume: number) => void;
  getPlayerState: () => number;
  destroy: () => void;
}

declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string,
        options: {
          videoId: string;
          playerVars?: Record<string, number | string>;
          events?: {
            onReady?: (event: { target: YTPlayer }) => void;
            onStateChange?: (event: { data: number }) => void;
            onError?: (event: { data: number }) => void;
          };
        }
      ) => YTPlayer;
      PlayerState: {
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
      };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const playerRef = useRef<YTPlayer | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleMusic = useCallback(() => {
    if (!playerRef.current) return;

    if (isPlaying) {
      playerRef.current.pauseVideo();
      setIsPlaying(false);
    } else {
      playerRef.current.unMute();
      playerRef.current.setVolume(50);
      playerRef.current.playVideo();
      setIsPlaying(true);
    }
  }, [isPlaying]);

  useEffect(() => {
    let mounted = true;

    function createPlayer() {
      if (!mounted || !window.YT) return;

      playerRef.current = new window.YT.Player('yt-music-player', {
        videoId: YOUTUBE_VIDEO_ID,
        playerVars: {
          autoplay: 0,
          loop: 1,
          playlist: YOUTUBE_VIDEO_ID,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
          origin: window.location.origin,
        },
        events: {
          onReady: (event) => {
            if (!mounted) return;
            event.target.setVolume(50);
            setIsReady(true);
          },
          onStateChange: (event) => {
            if (!mounted) return;
            if (event.data === window.YT.PlayerState.ENDED) {
              // Loop: replay
              playerRef.current?.playVideo();
            }
            setIsPlaying(
              event.data === window.YT.PlayerState.PLAYING
            );
          },
          onError: () => {
            // Silently handle errors
          },
        },
      });
    }

    // Load YT IFrame API if not loaded
    if (window.YT && window.YT.Player) {
      createPlayer();
    } else {
      const existingScript = document.querySelector(
        'script[src="https://www.youtube.com/iframe_api"]'
      );
      if (!existingScript) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(tag);
      }
      window.onYouTubeIframeAPIReady = createPlayer;
    }

    return () => {
      mounted = false;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, []);

  return (
    <>
      {/* Hidden YouTube player */}
      <div className="fixed -left-[9999px] -top-[9999px] w-0 h-0 overflow-hidden pointer-events-none" ref={containerRef}>
        <div id="yt-music-player" />
      </div>

      {/* Floating music toggle button */}
      {isReady && (
        <button
          onClick={toggleMusic}
          className={cn(
            'fixed bottom-6 right-6 z-50',
            'w-12 h-12 rounded-full',
            'flex items-center justify-center',
            'bg-gradient-to-br from-red-600 to-red-700',
            'border-2 border-amber-400/60',
            'shadow-lg shadow-red-500/30',
            'hover:shadow-xl hover:shadow-amber-400/30',
            'hover:scale-110 active:scale-95',
            'transition-all duration-300',
            'backdrop-blur-sm',
            isPlaying && 'animate-pulse-slow'
          )}
          title={isPlaying ? 'Tắt nhạc' : 'Bật nhạc'}
        >
          {isPlaying ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6 text-amber-300"
            >
              <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM17.78 9.22a.75.75 0 10-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 001.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 101.06-1.06L20.56 12l1.72-1.72a.75.75 0 00-1.06-1.06l-1.72 1.72-1.72-1.72z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6 text-amber-300"
            >
              <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 01-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
              <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
            </svg>
          )}
        </button>
      )}
    </>
  );
}
