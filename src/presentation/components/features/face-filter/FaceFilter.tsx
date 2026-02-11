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
    async function startCamera(): Promise<void> {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError(
          'Trình duyệt không hỗ trợ camera. Vui lòng truy cập qua HTTPS.',
        );
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setIsCameraReady(true);
        }
      } catch (err) {
        setCameraError(
          err instanceof Error ? err.message : 'Không thể truy cập camera',
        );
      }
    }

    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  // Render loop
  useEffect(() => {
    if (isLoading || !isCameraReady) return;

    function renderFrame(): void {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Skip frame if video not ready yet (common on mobile)
      if (!video.videoWidth || !video.videoHeight) {
        animFrameRef.current = requestAnimationFrame(renderFrame);
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const result = detect(video, performance.now());
      if (result?.faceLandmarks?.[0] && selectedFilterId) {
        const filter = FILTERS.find((f) => f.id === selectedFilterId);
        const image = filterImagesRef.current.get(selectedFilterId);
        if (filter && image) {
          drawFilter(ctx, result.faceLandmarks[0], filter, image, canvas.width, canvas.height);
        }
      }

      // Draw Tet frame overlay (scaled so the rectangular border aligns with canvas edges)
      // The frame image (500x500) has its border inset: ~10% left, ~14% top, ~8% right, ~10% bottom
      if (frameImageRef.current) {
        const borderLeft = 0.10;
        const borderTop = 0.14;
        const borderW = 0.82; // borderRight(0.92) - borderLeft(0.10)
        const borderH = 0.76; // borderBottom(0.90) - borderTop(0.14)
        const fw = canvas.width / borderW;
        const fh = canvas.height / borderH;
        const fx = -borderLeft * fw;
        const fy = -borderTop * fh;

        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(frameImageRef.current, -fx - fw, fy, fw, fh);
        ctx.restore();
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
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'face-filter-tet.png';
    link.href = dataUrl;
    link.click();
  }, []);

  const handleSelectFilter = useCallback((filterId: string | null) => {
    setSelectedFilterId(filterId);
  }, []);

  if (isLoading) {
    return (
      <div className="h-dvh flex flex-col items-center justify-center bg-gradient-to-b from-red-900 to-red-950 text-white">
        <div className="animate-spin w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full" />
        <p className="mt-4 text-amber-200">Đang tải mô hình nhận diện khuôn mặt...</p>
      </div>
    );
  }

  if (hasError || cameraError) {
    return (
      <div className="h-dvh flex flex-col items-center justify-center bg-gradient-to-b from-red-900 to-red-950 text-white p-6">
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
    );
  }

  return (
    <div className="h-dvh flex flex-col bg-gradient-to-b from-red-900 to-red-950 overflow-hidden">
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
        <video
          ref={videoRef}
          playsInline
          muted
          className="absolute opacity-0 pointer-events-none"
          style={{ width: 0, height: 0 }}
        />
        <canvas
          ref={canvasRef}
          className="max-w-full max-h-full"
          style={{ transform: 'scaleX(-1)', objectFit: 'contain' }}
        />
      </main>

      {/* Controls */}
      <footer className="px-4 pb-6 pt-3 space-y-3">
        {/* Filter selector */}
        <FilterSelector
          filters={FILTERS}
          selectedFilterId={selectedFilterId}
          onSelectFilter={handleSelectFilter}
        />

        {/* Capture button */}
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
    </div>
  );
}
