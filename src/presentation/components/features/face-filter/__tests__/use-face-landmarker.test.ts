import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

const { mockClose, mockDetectForVideo } = vi.hoisted(() => {
  return {
    mockClose: vi.fn(),
    mockDetectForVideo: vi.fn().mockReturnValue({ faceLandmarks: [] }),
  };
});

vi.mock('@mediapipe/tasks-vision', () => ({
  FilesetResolver: {
    forVisionTasks: vi.fn().mockResolvedValue({}),
  },
  FaceLandmarker: {
    createFromOptions: vi.fn().mockResolvedValue({
      close: mockClose,
      detectForVideo: mockDetectForVideo,
    }),
    FACE_LANDMARKS_TESSELATION: [],
  },
}));

import { useFaceLandmarker } from '../use-face-landmarker';
import { FaceLandmarker } from '@mediapipe/tasks-vision';

describe('useFaceLandmarker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (FaceLandmarker.createFromOptions as ReturnType<typeof vi.fn>).mockResolvedValue({
      close: mockClose,
      detectForVideo: mockDetectForVideo,
    });
  });

  it('starts with isLoading: true', () => {
    const { result } = renderHook(() => useFaceLandmarker());
    expect(result.current.isLoading).toBe(true);
  });

  it('after init completes, isLoading is false', async () => {
    const { result } = renderHook(() => useFaceLandmarker());
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('faceLandmarkerRef is set after init', async () => {
    const { result } = renderHook(() => useFaceLandmarker());
    await waitFor(() => {
      expect(result.current.faceLandmarkerRef.current).toBeTruthy();
      expect(result.current.faceLandmarkerRef.current).toHaveProperty('detectForVideo');
    });
  });

  it('sets hasError true if initialization fails', async () => {
    (FaceLandmarker.createFromOptions as ReturnType<typeof vi.fn>)
      .mockRejectedValueOnce(new Error('GPU failed'))
      .mockRejectedValueOnce(new Error('CPU also failed'));

    const { result } = renderHook(() => useFaceLandmarker());
    await waitFor(() => {
      expect(result.current.hasError).toBe(true);
    });
  });

  it('sets errorMessage with description on failure', async () => {
    (FaceLandmarker.createFromOptions as ReturnType<typeof vi.fn>)
      .mockRejectedValueOnce(new Error('GPU failed'))
      .mockRejectedValueOnce(new Error('CPU also failed'));

    const { result } = renderHook(() => useFaceLandmarker());
    await waitFor(() => {
      expect(result.current.errorMessage).toBeTruthy();
      expect(typeof result.current.errorMessage).toBe('string');
    });
  });

  it('tries CPU fallback if GPU delegate fails', async () => {
    (FaceLandmarker.createFromOptions as ReturnType<typeof vi.fn>)
      .mockRejectedValueOnce(new Error('GPU failed'))
      .mockResolvedValueOnce({
        close: mockClose,
        detectForVideo: mockDetectForVideo,
      });

    const { result } = renderHook(() => useFaceLandmarker());
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.hasError).toBe(false);
    });
    expect(FaceLandmarker.createFromOptions).toHaveBeenCalledTimes(2);
  });

  it('detect() returns null when not initialized', () => {
    const { result } = renderHook(() => useFaceLandmarker());
    const detection = result.current.detect(document.createElement('video'), 0);
    expect(detection).toBeNull();
  });

  it('detect() calls detectForVideo when initialized', async () => {
    const { result } = renderHook(() => useFaceLandmarker());
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    const video = document.createElement('video');
    result.current.detect(video, 100);
    expect(mockDetectForVideo).toHaveBeenCalledWith(video, 100);
  });

  it('calls faceLandmarker.close() on unmount', async () => {
    const { result, unmount } = renderHook(() => useFaceLandmarker());
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    unmount();
    expect(mockClose).toHaveBeenCalled();
  });
});
