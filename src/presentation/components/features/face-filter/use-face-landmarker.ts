'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import {
  FilesetResolver,
  FaceLandmarker,
  type FaceLandmarkerResult,
} from '@mediapipe/tasks-vision';

const WASM_CDN =
  'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm';
const MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';

interface UseFaceLandmarkerReturn {
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string;
  faceLandmarkerRef: React.RefObject<FaceLandmarker | null>;
  detect: (video: HTMLVideoElement, timestamp: number) => FaceLandmarkerResult | null;
}

export function useFaceLandmarker(): UseFaceLandmarkerReturn {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function init(): Promise<void> {
      try {
        console.log('[FaceLandmarker] Loading WASM module...');
        const vision = await FilesetResolver.forVisionTasks(WASM_CDN);
        console.log('[FaceLandmarker] WASM module loaded OK');

        try {
          // Try GPU first
          console.log('[FaceLandmarker] Trying GPU delegate...');
          const landmarker = await FaceLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: MODEL_URL,
              delegate: 'GPU',
            },
            runningMode: 'VIDEO',
            numFaces: 1,
            outputFaceBlendshapes: false,
            outputFacialTransformationMatrixes: false,
          });
          if (!cancelled) {
            console.log('[FaceLandmarker] GPU delegate OK');
            faceLandmarkerRef.current = landmarker;
            setIsLoading(false);
          }
        } catch (gpuErr) {
          // Fallback to CPU
          console.warn('[FaceLandmarker] GPU failed, trying CPU...', gpuErr);
          try {
            const landmarker = await FaceLandmarker.createFromOptions(vision, {
              baseOptions: {
                modelAssetPath: MODEL_URL,
                delegate: 'CPU',
              },
              runningMode: 'VIDEO',
              numFaces: 1,
              outputFaceBlendshapes: false,
              outputFacialTransformationMatrixes: false,
            });
            if (!cancelled) {
              console.log('[FaceLandmarker] CPU delegate OK');
              faceLandmarkerRef.current = landmarker;
              setIsLoading(false);
            }
          } catch (cpuErr) {
            console.error('[FaceLandmarker] CPU also failed:', cpuErr);
            if (!cancelled) {
              setHasError(true);
              setErrorMessage(
                cpuErr instanceof Error
                  ? cpuErr.message
                  : 'Không thể khởi tạo face detection',
              );
              setIsLoading(false);
            }
          }
        }
      } catch (err) {
        console.error('[FaceLandmarker] WASM load failed:', err);
        if (!cancelled) {
          setHasError(true);
          setErrorMessage(
            err instanceof Error
              ? err.message
              : 'Không thể tải WASM module',
          );
          setIsLoading(false);
        }
      }
    }

    init();

    return () => {
      cancelled = true;
      if (faceLandmarkerRef.current) {
        faceLandmarkerRef.current.close();
      }
    };
  }, []);

  const detect = useCallback(
    (video: HTMLVideoElement, timestamp: number): FaceLandmarkerResult | null => {
      if (!faceLandmarkerRef.current) return null;
      if (video.readyState < 2) return null;
      try {
        return faceLandmarkerRef.current.detectForVideo(video, timestamp);
      } catch {
        return null;
      }
    },
    [],
  );

  return {
    isLoading,
    hasError,
    errorMessage,
    faceLandmarkerRef,
    detect,
  };
}
