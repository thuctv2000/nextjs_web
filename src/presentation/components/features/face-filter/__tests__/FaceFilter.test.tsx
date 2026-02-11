import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

// Must use vi.hoisted for variables referenced in vi.mock factories
const { mockDetect, mockIsLoading, mockHasError, mockErrorMessage } = vi.hoisted(() => ({
  mockDetect: vi.fn().mockReturnValue(null),
  mockIsLoading: { value: false },
  mockHasError: { value: false },
  mockErrorMessage: { value: '' },
}));

vi.mock('../use-face-landmarker', () => ({
  useFaceLandmarker: () => ({
    isLoading: mockIsLoading.value,
    hasError: mockHasError.value,
    errorMessage: mockErrorMessage.value,
    faceLandmarkerRef: { current: null },
    detect: mockDetect,
  }),
}));

vi.mock('../filters', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../filters')>();
  return {
    ...actual,
    preloadFilterImages: vi.fn().mockResolvedValue(new Map()),
  };
});

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

import { FaceFilter } from '../FaceFilter';

describe('FaceFilter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsLoading.value = false;
    mockHasError.value = false;
    mockErrorMessage.value = '';
  });

  describe('Loading state', () => {
    it('shows loading indicator while model initializes', () => {
      mockIsLoading.value = true;
      render(<FaceFilter />);
      expect(screen.getByText(/đang tải/i)).toBeInTheDocument();
    });
  });

  describe('Error state', () => {
    it('shows error message when MediaPipe fails to load', () => {
      mockHasError.value = true;
      mockErrorMessage.value = 'Không thể khởi tạo face detection';
      render(<FaceFilter />);
      expect(screen.getByText(/không thể/i)).toBeInTheDocument();
    });
  });

  describe('Active state', () => {
    it('renders canvas element', () => {
      render(<FaceFilter />);
      const canvas = document.querySelector('canvas');
      expect(canvas).toBeInTheDocument();
    });

    it('canvas has scaleX(-1) transform style for mirror effect', () => {
      render(<FaceFilter />);
      const canvas = document.querySelector('canvas');
      expect(canvas?.style.transform).toContain('scaleX(-1)');
    });

    it('renders capture button', () => {
      render(<FaceFilter />);
      expect(screen.getByRole('button', { name: /chụp|capture/i })).toBeInTheDocument();
    });

    it('renders FilterSelector component', () => {
      render(<FaceFilter />);
      // FilterSelector renders a "Không" (None) button
      expect(screen.getByRole('button', { name: /không/i })).toBeInTheDocument();
    });

    it('renders back link to /lixi/greeting', () => {
      render(<FaceFilter />);
      const link = screen.getByRole('link', { name: /quay lại|back/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/lixi/greeting');
    });
  });
});
