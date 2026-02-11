import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  FILTERS,
  getAnchorPosition,
  getFaceRotation,
  getFaceWidth,
  drawFilter,
  preloadFilterImages,
  type FaceFilterDefinition,
} from '../filters';

// Helper: create normalized landmarks (values 0-1)
function makeLandmarks(overrides: Record<number, { x: number; y: number; z: number }> = {}): { x: number; y: number; z: number }[] {
  const landmarks = Array.from({ length: 478 }, () => ({ x: 0.5, y: 0.5, z: 0 }));
  for (const [idx, val] of Object.entries(overrides)) {
    landmarks[Number(idx)] = val;
  }
  return landmarks;
}

describe('FILTERS', () => {
  it('has 5 filter entries', () => {
    expect(FILTERS).toHaveLength(5);
  });

  it('each filter has required fields', () => {
    for (const f of FILTERS) {
      expect(f).toHaveProperty('id');
      expect(f).toHaveProperty('name');
      expect(f).toHaveProperty('icon');
      expect(f).toHaveProperty('imageSrc');
      expect(f).toHaveProperty('anchor');
      expect(f).toHaveProperty('offsetY');
      expect(f).toHaveProperty('scaleMultiplier');
    }
  });

  it('each filter id is unique', () => {
    const ids = FILTERS.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('each filter anchor is a valid type', () => {
    const validAnchors = ['eyes', 'forehead', 'nose', 'mouth'];
    for (const f of FILTERS) {
      expect(validAnchors).toContain(f.anchor);
    }
  });
});

describe('getAnchorPosition', () => {
  const canvasW = 640;
  const canvasH = 480;

  it('returns midpoint of eyes for "eyes" anchor', () => {
    const landmarks = makeLandmarks({
      263: { x: 0.6, y: 0.4, z: 0 }, // left eye outer
      33: { x: 0.4, y: 0.4, z: 0 },  // right eye outer
    });
    const pos = getAnchorPosition(landmarks, 'eyes', canvasW, canvasH);
    expect(pos.x).toBeCloseTo(0.5 * canvasW);
    expect(pos.y).toBeCloseTo(0.4 * canvasH);
  });

  it('returns landmark 10 for "forehead" anchor', () => {
    const landmarks = makeLandmarks({
      10: { x: 0.5, y: 0.2, z: 0 },
    });
    const pos = getAnchorPosition(landmarks, 'forehead', canvasW, canvasH);
    expect(pos.x).toBeCloseTo(0.5 * canvasW);
    expect(pos.y).toBeCloseTo(0.2 * canvasH);
  });

  it('returns landmark 1 for "nose" anchor', () => {
    const landmarks = makeLandmarks({
      1: { x: 0.5, y: 0.55, z: 0 },
    });
    const pos = getAnchorPosition(landmarks, 'nose', canvasW, canvasH);
    expect(pos.x).toBeCloseTo(0.5 * canvasW);
    expect(pos.y).toBeCloseTo(0.55 * canvasH);
  });

  it('returns midpoint of mouth corners for "mouth" anchor', () => {
    const landmarks = makeLandmarks({
      61: { x: 0.45, y: 0.7, z: 0 },  // mouth left
      291: { x: 0.55, y: 0.7, z: 0 }, // mouth right
    });
    const pos = getAnchorPosition(landmarks, 'mouth', canvasW, canvasH);
    expect(pos.x).toBeCloseTo(0.5 * canvasW);
    expect(pos.y).toBeCloseTo(0.7 * canvasH);
  });
});

describe('getFaceRotation', () => {
  const canvasW = 640;
  const canvasH = 480;

  it('returns 0 for horizontally aligned eyes', () => {
    const landmarks = makeLandmarks({
      263: { x: 0.6, y: 0.4, z: 0 },
      33: { x: 0.4, y: 0.4, z: 0 },
    });
    const angle = getFaceRotation(landmarks, canvasW, canvasH);
    expect(angle).toBeCloseTo(0);
  });

  it('returns negative angle when left eye (263) is higher', () => {
    const landmarks = makeLandmarks({
      263: { x: 0.6, y: 0.35, z: 0 }, // left eye higher (smaller y)
      33: { x: 0.4, y: 0.45, z: 0 },
    });
    const angle = getFaceRotation(landmarks, canvasW, canvasH);
    // dx positive (0.6-0.4), dy negative (0.35-0.45) → negative atan2
    expect(angle).toBeLessThan(0);
  });

  it('returns positive angle when right eye (33) is higher', () => {
    const landmarks = makeLandmarks({
      263: { x: 0.6, y: 0.45, z: 0 },
      33: { x: 0.4, y: 0.35, z: 0 }, // right eye higher (smaller y)
    });
    const angle = getFaceRotation(landmarks, canvasW, canvasH);
    // dx positive (0.6-0.4), dy positive (0.45-0.35) → positive atan2
    expect(angle).toBeGreaterThan(0);
  });
});

describe('getFaceWidth', () => {
  it('returns correct pixel distance between outer eye landmarks', () => {
    const canvasW = 640;
    const landmarks = makeLandmarks({
      263: { x: 0.6, y: 0.4, z: 0 },
      33: { x: 0.4, y: 0.4, z: 0 },
    });
    const width = getFaceWidth(landmarks, canvasW);
    expect(width).toBeCloseTo(0.2 * canvasW);
  });
});

describe('drawFilter', () => {
  let ctx: CanvasRenderingContext2D;

  beforeEach(() => {
    ctx = {
      save: vi.fn(),
      restore: vi.fn(),
      translate: vi.fn(),
      rotate: vi.fn(),
      drawImage: vi.fn(),
      clearRect: vi.fn(),
      scale: vi.fn(),
    } as unknown as CanvasRenderingContext2D;
  });

  const filter: FaceFilterDefinition = {
    id: 'test',
    name: 'Test',
    icon: '🎭',
    imageSrc: '/test.png',
    anchor: 'eyes',
    offsetY: 0,
    scaleMultiplier: 1.5,
  };

  const landmarks = makeLandmarks({
    263: { x: 0.6, y: 0.4, z: 0 },
    33: { x: 0.4, y: 0.4, z: 0 },
  });

  const mockImage = { width: 200, height: 100 } as HTMLImageElement;

  it('calls ctx.save() and ctx.restore()', () => {
    drawFilter(ctx, landmarks, filter, mockImage, 640, 480);
    expect(ctx.save).toHaveBeenCalled();
    expect(ctx.restore).toHaveBeenCalled();
  });

  it('calls ctx.translate() with anchor position', () => {
    drawFilter(ctx, landmarks, filter, mockImage, 640, 480);
    expect(ctx.translate).toHaveBeenCalled();
    const [x, y] = (ctx.translate as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(typeof x).toBe('number');
    expect(typeof y).toBe('number');
  });

  it('calls ctx.rotate() with face rotation angle', () => {
    drawFilter(ctx, landmarks, filter, mockImage, 640, 480);
    expect(ctx.rotate).toHaveBeenCalled();
  });

  it('calls ctx.drawImage() with the filter image', () => {
    drawFilter(ctx, landmarks, filter, mockImage, 640, 480);
    expect(ctx.drawImage).toHaveBeenCalledWith(
      mockImage,
      expect.any(Number),
      expect.any(Number),
      expect.any(Number),
      expect.any(Number),
    );
  });
});

describe('preloadFilterImages', () => {
  it('returns a Map with keys matching filter ids', async () => {
    const filters: FaceFilterDefinition[] = [
      { id: 'a', name: 'A', icon: '🅰️', imageSrc: '/a.png', anchor: 'eyes', offsetY: 0, scaleMultiplier: 1 },
      { id: 'b', name: 'B', icon: '🅱️', imageSrc: '/b.png', anchor: 'nose', offsetY: 0, scaleMultiplier: 1 },
    ];
    const map = await preloadFilterImages(filters);
    expect(map.has('a')).toBe(true);
    expect(map.has('b')).toBe(true);
    expect(map.size).toBe(2);
  });

  it('each value is an HTMLImageElement with correct src', async () => {
    const filters: FaceFilterDefinition[] = [
      { id: 'c', name: 'C', icon: '©️', imageSrc: '/c.png', anchor: 'forehead', offsetY: 0, scaleMultiplier: 1 },
    ];
    const map = await preloadFilterImages(filters);
    const img = map.get('c');
    expect(img).toBeDefined();
    expect(img!.src).toBe('/c.png');
  });
});
