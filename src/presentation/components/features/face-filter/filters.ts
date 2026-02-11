export interface FaceFilterDefinition {
  id: string;
  name: string;
  icon: string;
  imageSrc: string;
  anchor: 'eyes' | 'forehead' | 'nose' | 'mouth' | 'face-center';
  offsetX: number;
  offsetY: number;
  scaleMultiplier: number;
  widthBasis?: 'eyes' | 'face';
}

// Landmark indices
const FOREHEAD = 10;
const NOSE = 1;
const LEFT_EYE_OUTER = 263;
const RIGHT_EYE_OUTER = 33;
const MOUTH_LEFT = 61;
const MOUTH_RIGHT = 291;
// Face contour - widest points (cheeks)
const LEFT_CHEEK = 454;
const RIGHT_CHEEK = 234;
const CHIN = 152;

export const FILTERS: FaceFilterDefinition[] = [
  {
    id: 'sunglasses',
    name: 'Kính mát',
    icon: '🕶️',
    imageSrc: '/filters/sunglasses.svg',
    anchor: 'eyes',
    offsetX: 0,
    offsetY: 0,
    scaleMultiplier: 1.8,
  },
  {
    id: 'party-hat',
    name: 'Nón tiệc',
    icon: '🎉',
    imageSrc: '/filters/party-hat.svg',
    anchor: 'forehead',
    offsetX: 0,
    offsetY: -0.6,
    scaleMultiplier: 2.0,
  },
  {
    id: 'dog-filter',
    name: 'Cún yêu',
    icon: '🐶',
    imageSrc: '/filters/dog-filter.svg',
    anchor: 'nose',
    offsetX: 0,
    offsetY: 0,
    scaleMultiplier: 2.2,
  },
  {
    id: 'flower-crown',
    name: 'Vòng hoa',
    icon: '🌸',
    imageSrc: '/filters/flower-crown.svg',
    anchor: 'forehead',
    offsetX: 0,
    offsetY: -0.5,
    scaleMultiplier: 2.2,
  },
  {
    id: 'mustache',
    name: 'Ria mép',
    icon: '🥸',
    imageSrc: '/filters/mustache.svg',
    anchor: 'mouth',
    offsetX: 0,
    offsetY: -0.15,
    scaleMultiplier: 1.2,
  },
  {
    id: 'horse-face',
    name: 'Mặt ngựa',
    icon: '🐴',
    imageSrc: '/filters/horse_face.png',
    anchor: 'face-center',
    offsetX: 0,
    offsetY: 0.08,
    scaleMultiplier: 2.2,
    widthBasis: 'face',
  },
];

interface Landmark {
  x: number;
  y: number;
  z: number;
}

export function getAnchorPosition(
  landmarks: Landmark[],
  anchor: FaceFilterDefinition['anchor'],
  canvasW: number,
  canvasH: number,
): { x: number; y: number } {
  switch (anchor) {
    case 'eyes': {
      const left = landmarks[LEFT_EYE_OUTER];
      const right = landmarks[RIGHT_EYE_OUTER];
      return {
        x: ((left.x + right.x) / 2) * canvasW,
        y: ((left.y + right.y) / 2) * canvasH,
      };
    }
    case 'forehead': {
      const pt = landmarks[FOREHEAD];
      return { x: pt.x * canvasW, y: pt.y * canvasH };
    }
    case 'nose': {
      const pt = landmarks[NOSE];
      return { x: pt.x * canvasW, y: pt.y * canvasH };
    }
    case 'mouth': {
      const left = landmarks[MOUTH_LEFT];
      const right = landmarks[MOUTH_RIGHT];
      return {
        x: ((left.x + right.x) / 2) * canvasW,
        y: ((left.y + right.y) / 2) * canvasH,
      };
    }
    case 'face-center': {
      const top = landmarks[FOREHEAD];
      const bottom = landmarks[CHIN];
      return {
        x: ((top.x + bottom.x) / 2) * canvasW,
        y: ((top.y + bottom.y) / 2) * canvasH,
      };
    }
  }
}

export function getFaceRotation(
  landmarks: Landmark[],
  canvasW: number,
  canvasH: number,
): number {
  const leftEye = landmarks[LEFT_EYE_OUTER];
  const rightEye = landmarks[RIGHT_EYE_OUTER];
  const dx = (leftEye.x - rightEye.x) * canvasW;
  const dy = (leftEye.y - rightEye.y) * canvasH;
  return Math.atan2(dy, dx);
}

export function getFaceWidth(landmarks: Landmark[], canvasW: number): number {
  const leftEye = landmarks[LEFT_EYE_OUTER];
  const rightEye = landmarks[RIGHT_EYE_OUTER];
  return Math.abs(leftEye.x - rightEye.x) * canvasW;
}

export function getFaceFullWidth(landmarks: Landmark[], canvasW: number): number {
  const left = landmarks[LEFT_CHEEK];
  const right = landmarks[RIGHT_CHEEK];
  return Math.abs(left.x - right.x) * canvasW;
}

export function drawFilter(
  ctx: CanvasRenderingContext2D,
  landmarks: Landmark[],
  filter: FaceFilterDefinition,
  image: HTMLImageElement,
  canvasW: number,
  canvasH: number,
): void {
  const anchor = getAnchorPosition(landmarks, filter.anchor, canvasW, canvasH);
  const rotation = getFaceRotation(landmarks, canvasW, canvasH);
  const faceW = filter.widthBasis === 'face'
    ? getFaceFullWidth(landmarks, canvasW)
    : getFaceWidth(landmarks, canvasW);
  const imgW = image.naturalWidth || image.width;
  const imgH = image.naturalHeight || image.height;
  if (!imgW || !imgH) return;

  const filterW = faceW * filter.scaleMultiplier;
  const filterH = filterW * (imgH / imgW);
  const offsetXPx = filter.offsetX * filterW;
  const offsetYPx = filter.offsetY * filterH;

  ctx.save();
  ctx.translate(anchor.x + offsetXPx, anchor.y + offsetYPx);
  ctx.rotate(rotation);
  ctx.drawImage(image, -filterW / 2, -filterH / 2, filterW, filterH);
  ctx.restore();
}

export function preloadFilterImages(
  filters: FaceFilterDefinition[],
): Promise<Map<string, HTMLImageElement>> {
  const entries = filters.map(
    (f) =>
      new Promise<[string, HTMLImageElement]>((resolve) => {
        const img = new Image();
        img.onload = () => resolve([f.id, img]);
        img.onerror = () => resolve([f.id, img]);
        img.src = f.imageSrc;
      }),
  );
  return Promise.all(entries).then((pairs) => new Map(pairs));
}
