'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useFaceLandmarker } from './use-face-landmarker';
import { FilterSelector } from './FilterSelector';
import {
  FILTERS,
  drawFilter,
  preloadFilterImages,
  type FaceFilterDefinition,
} from './filters';

export function FaceFilter(): React.ReactElement {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const filterImagesRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const frameImageRef = useRef<HTMLImageElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const { isLoading, hasError, errorMessage, detect } = useFaceLandmarker();
  const [selectedFilterId, setSelectedFilterId] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState('');

  // Preload filter images + Tet frame
  useEffect(() => {
    preloadFilterImages(FILTERS).then((map) => {
      filterImagesRef.current = map;
    });
    const frameImg = new Image();
    frameImg.onload = () => { frameImageRef.current = frameImg; };
    frameImg.src = '/filters/tet-frame.png';
  }, []);

  // Start camera
  useEffect(() => {
    let cancelled = false;

    async function startCamera(): Promise<void> {
      console.log('[Camera] Starting camera...');
      if (!navigator.mediaDevices?.getUserMedia) {
        if (!cancelled) {
          setCameraError(
            'Trình duyệt không hỗ trợ camera. Vui lòng truy cập qua HTTPS.',
          );
        }
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        console.log('[Camera] Got stream, tracks:', stream.getTracks().map(t => `${t.kind}:${t.readyState}`));
        streamRef.current = stream;
        const video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          console.log('[Camera] Set srcObject, waiting for playing event...');
          // Use 'playing' event — fires when video actually renders frames (more reliable on mobile than 'loadeddata')
          video.onplaying = () => {
            console.log('[Camera] Video playing! videoWidth:', video.videoWidth, 'videoHeight:', video.videoHeight);
            if (!cancelled) setIsCameraReady(true);
          };
          video.play().catch((err) => {
            // Only report real errors, ignore AbortError from unmount
            if (!cancelled && err instanceof DOMException && err.name !== 'AbortError') {
              setCameraError('Không thể phát video camera');
            }
          });
        }
      } catch (err) {
        console.error('[Camera] getUserMedia error:', err);
        if (!cancelled) {
          setCameraError(
            err instanceof Error ? err.message : 'Không thể truy cập camera',
          );
        }
      }
    }

    startCamera();

    return () => {
      cancelled = true;
      const video = videoRef.current;
      if (video) {
        video.onplaying = null;
        video.srcObject = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, []);

  // Render loop
  useEffect(() => {
    if (isLoading || !isCameraReady) {
      console.log('[Render] Waiting... isLoading:', isLoading, 'isCameraReady:', isCameraReady);
      return;
    }

    console.log('[Render] Starting render loop');
    let frameCount = 0;

    function renderFrame(): void {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) {
        console.warn('[Render] Missing refs - video:', !!video, 'canvas:', !!canvas);
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.warn('[Render] Cannot get 2d context');
        return;
      }

      // Skip frame if video not ready yet (common on mobile)
      if (!video.videoWidth || !video.videoHeight) {
        if (frameCount === 0) console.log('[Render] Video dimensions not ready yet, waiting...');
        animFrameRef.current = requestAnimationFrame(renderFrame);
        return;
      }

      if (frameCount === 0) {
        console.log('[Render] First frame! Video:', video.videoWidth, 'x', video.videoHeight);
      }
      frameCount++;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const result = detect(video, performance.now());
      if (result?.faceLandmarks && selectedFilterId) {
        const filter = FILTERS.find((f) => f.id === selectedFilterId);
        const image = filterImagesRef.current.get(selectedFilterId);
        if (filter && image) {
          for (const landmarks of result.faceLandmarks) {
            drawFilter(ctx, landmarks, filter, image, canvas.width, canvas.height);
          }
        }
      }

      // Draw Tet frame overlay covering full canvas
      if (frameImageRef.current) {
        ctx.drawImage(frameImageRef.current, 0, 0, canvas.width, canvas.height);
      }

      animFrameRef.current = requestAnimationFrame(renderFrame);
    }

    animFrameRef.current = requestAnimationFrame(renderFrame);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [isLoading, isCameraReady, selectedFilterId, detect]);

  const handleCapture = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Flip horizontally to match what user sees on screen (CSS scaleX(-1))
    const tmp = document.createElement('canvas');
    tmp.width = canvas.width;
    tmp.height = canvas.height;
    const tmpCtx = tmp.getContext('2d');
    if (!tmpCtx) return;
    tmpCtx.translate(tmp.width, 0);
    tmpCtx.scale(-1, 1);
    tmpCtx.drawImage(canvas, 0, 0);

    const dataUrl = tmp.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'face-filter-tet.png';
    link.href = dataUrl;
    link.click();
  }, []);

  const handleSelectFilter = useCallback((filterId: string | null) => {
    setSelectedFilterId(filterId);
  }, []);

  return (
    <div className="h-dvh flex flex-col bg-gradient-to-b from-red-900 to-red-950 overflow-hidden">
      {/* Hidden video — always in DOM so videoRef is available when camera stream arrives */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="pointer-events-none absolute"
        style={{ width: '1px', height: '1px', opacity: 0, overflow: 'hidden' }}
      />

      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center text-white">
          <div className="animate-spin w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full" />
          <p className="mt-4 text-amber-200">Đang tải mô hình nhận diện khuôn mặt...</p>
        </div>
      ) : hasError || cameraError ? (
        <div className="flex-1 flex flex-col items-center justify-center text-white p-6">
          <p className="text-2xl mb-2">😞</p>
          <p className="text-center text-amber-200">{errorMessage || cameraError}</p>
          <Link
            href="/lixi/greeting"
            className="mt-6 px-6 py-3 bg-amber-500 text-red-900 font-bold rounded-full"
            aria-label="Quay lại"
          >
            Quay lại
          </Link>
        </div>
      ) : (
        <>
          {/* Header */}
          <header className="flex items-center justify-between px-4 py-3">
            <Link
              href="/lixi/greeting"
              className="text-amber-200 text-sm flex items-center gap-1"
              aria-label="Quay lại"
            >
              ← Quay lại
            </Link>
            <h1 className="text-amber-200 font-bold text-lg">Face Filter</h1>
            <div className="w-16" />
          </header>

          {/* Camera + Canvas */}
          <main className="flex-1 relative flex items-center justify-center overflow-hidden bg-black">
            <canvas
              ref={canvasRef}
              className="max-w-full max-h-full"
              style={{ transform: 'scaleX(-1)', objectFit: 'contain' }}
            />
          </main>

          {/* Controls */}
          <footer className="px-4 pb-6 pt-3 space-y-3">
            <FilterSelector
              filters={FILTERS}
              selectedFilterId={selectedFilterId}
              onSelectFilter={handleSelectFilter}
            />
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleCapture}
                aria-label="Chụp ảnh"
                className="w-16 h-16 rounded-full border-4 border-amber-400 bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 active:scale-90 transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-amber-400" />
              </button>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}
