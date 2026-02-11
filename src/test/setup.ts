import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Mock navigator.mediaDevices.getUserMedia
Object.defineProperty(navigator, 'mediaDevices', {
  value: {
    getUserMedia: vi.fn().mockResolvedValue({
      getTracks: () => [{ stop: vi.fn() }],
      getVideoTracks: () => [
        {
          stop: vi.fn(),
          getSettings: () => ({ width: 640, height: 480 }),
        },
      ],
    }),
  },
  writable: true,
});

// Mock HTMLCanvasElement.getContext
const mockContext2D = {
  save: vi.fn(),
  restore: vi.fn(),
  translate: vi.fn(),
  rotate: vi.fn(),
  drawImage: vi.fn(),
  clearRect: vi.fn(),
  scale: vi.fn(),
  fillRect: vi.fn(),
  fillStyle: '',
  canvas: { width: 640, height: 480 },
};

HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue(mockContext2D);
HTMLCanvasElement.prototype.toDataURL = vi.fn().mockReturnValue('data:image/png;base64,mock');

// Mock requestAnimationFrame / cancelAnimationFrame
let rafId = 0;
global.requestAnimationFrame = vi.fn((cb) => {
  rafId += 1;
  setTimeout(cb, 0);
  return rafId;
});
global.cancelAnimationFrame = vi.fn();

// Mock HTMLVideoElement.play
HTMLVideoElement.prototype.play = vi.fn().mockResolvedValue(undefined);

// Mock Image constructor for preloading
class MockImage {
  src = '';
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  width = 100;
  height = 100;

  constructor() {
    setTimeout(() => {
      if (this.onload) this.onload();
    }, 0);
  }
}

global.Image = MockImage as unknown as typeof Image;
