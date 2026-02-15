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
    offsetX: 0.1,
    offsetY: -0.1,
    scaleMultiplier: 2.25,
    widthBasis: 'face',
  },
  {
    id: 'cat-ears',
    name: 'Tai mèo',
    icon: '🐱',
    imageSrc: '/filters/cat-ears.svg',
    anchor: 'forehead',
    offsetX: 0,
    offsetY: -0.7,
    scaleMultiplier: 2.0,
  },
  {
    id: 'clown-nose',
    name: 'Mũi hề',
    icon: '🤡',
    imageSrc: '/filters/clown-nose.svg',
    anchor: 'nose',
    offsetX: 0,
    offsetY: 0,
    scaleMultiplier: 0.8,
  },
  {
    id: 'angel-halo',
    name: 'Thiên thần',
    icon: '😇',
    imageSrc: '/filters/angel-halo.svg',
    anchor: 'forehead',
    offsetX: 0,
    offsetY: -0.8,
    scaleMultiplier: 2.2,
  },
  {
    id: 'devil-horns',
    name: 'Sừng quỷ',
    icon: '😈',
    imageSrc: '/filters/devil-horns.svg',
    anchor: 'forehead',
    offsetX: 0,
    offsetY: -0.7,
    scaleMultiplier: 2.0,
  },
  {
    id: 'bunny-ears',
    name: 'Tai thỏ',
    icon: '🐰',
    imageSrc: '/filters/bunny-ears.svg',
    anchor: 'forehead',
    offsetX: 0,
    offsetY: -0.8,
    scaleMultiplier: 2.2,
  },
  {
    id: 'crown',
    name: 'Vương miện',
    icon: '👑',
    imageSrc: '/filters/crown.svg',
    anchor: 'forehead',
    offsetX: 0,
    offsetY: -0.6,
    scaleMultiplier: 2.0,
  },
  {
    id: 'heart-eyes',
    name: 'Mắt tim',
    icon: '😍',
    imageSrc: '/filters/heart-eyes.svg',
    anchor: 'eyes',
    offsetX: 0,
    offsetY: 0,
    scaleMultiplier: 1.8,
  },
  {
    id: 'beard',
    name: 'Râu xồm',
    icon: '🧔',
    imageSrc: '/filters/beard.svg',
    anchor: 'mouth',
    offsetX: 0,
    offsetY: 0.1,
    scaleMultiplier: 1.8,
    widthBasis: 'face',
  },
  // --- Animals ---
  {
    id: 'fox-ears',
    name: 'Tai cáo',
    icon: '🦊',
    imageSrc: '/filters/fox-ears.svg',
    anchor: 'forehead',
    offsetX: 0,
    offsetY: -0.7,
    scaleMultiplier: 2.0,
  },
  {
    id: 'bear-ears',
    name: 'Tai gấu',
    icon: '🐻',
    imageSrc: '/filters/bear-ears.svg',
    anchor: 'forehead',
    offsetX: 0,
    offsetY: -0.6,
    scaleMultiplier: 2.2,
  },
  {
    id: 'pig-nose',
    name: 'Mũi heo',
    icon: '🐷',
    imageSrc: '/filters/pig-nose.svg',
    anchor: 'nose',
    offsetX: 0,
    offsetY: 0,
    scaleMultiplier: 1.0,
  },
  {
    id: 'panda-face',
    name: 'Gấu trúc',
    icon: '🐼',
    imageSrc: '/filters/panda-face.svg',
    anchor: 'face-center',
    offsetX: 0,
    offsetY: 0,
    scaleMultiplier: 2.0,
    widthBasis: 'face',
  },
  {
    id: 'frog-eyes',
    name: 'Ếch con',
    icon: '🐸',
    imageSrc: '/filters/frog-eyes.svg',
    anchor: 'eyes',
    offsetX: 0,
    offsetY: -0.2,
    scaleMultiplier: 2.0,
  },
  {
    id: 'mouse-ears',
    name: 'Tai chuột',
    icon: '🐭',
    imageSrc: '/filters/mouse-ears.svg',
    anchor: 'forehead',
    offsetX: 0,
    offsetY: -0.6,
    scaleMultiplier: 2.2,
  },
  {
    id: 'deer-antlers',
    name: 'Sừng hươu',
    icon: '🦌',
    imageSrc: '/filters/deer-antlers.svg',
    anchor: 'forehead',
    offsetX: 0,
    offsetY: -0.7,
    scaleMultiplier: 2.2,
  },
  {
    id: 'lion-mane',
    name: 'Bờm sư tử',
    icon: '🦁',
    imageSrc: '/filters/lion-mane.svg',
    anchor: 'face-center',
    offsetX: 0,
    offsetY: 0,
    scaleMultiplier: 2.5,
    widthBasis: 'face',
  },
  {
    id: 'owl-eyes',
    name: 'Mắt cú',
    icon: '🦉',
    imageSrc: '/filters/owl-eyes.svg',
    anchor: 'eyes',
    offsetX: 0,
    offsetY: 0,
    scaleMultiplier: 2.0,
  },
  {
    id: 'unicorn-horn',
    name: 'Kỳ lân',
    icon: '🦄',
    imageSrc: '/filters/unicorn-horn.svg',
    anchor: 'forehead',
    offsetX: 0,
    offsetY: -0.9,
    scaleMultiplier: 1.2,
  },
  // --- Hats & Headwear ---
  {
    id: 'cowboy-hat',
    name: 'Mũ cao bồi',
    icon: '🤠',
    imageSrc: '/filters/cowboy-hat.svg',
    anchor: 'forehead',
    offsetX: 0,
    offsetY: -0.5,
    scaleMultiplier: 2.4,
  },
  {
    id: 'wizard-hat',
    name: 'Mũ phù thủy',
    icon: '🧙',
    imageSrc: '/filters/wizard-hat.svg',
    anchor: 'forehead',
    offsetX: 0,
    offsetY: -0.9,
    scaleMultiplier: 2.0,
  },
  {
    id: 'santa-hat',
    name: 'Mũ Noel',
    icon: '🎅',
    imageSrc: '/filters/santa-hat.svg',
    anchor: 'forehead',
    offsetX: 0.1,
    offsetY: -0.6,
    scaleMultiplier: 2.2,
  },
  {
    id: 'top-hat',
    name: 'Mũ xi-nê',
    icon: '🎩',
    imageSrc: '/filters/top-hat.svg',
    anchor: 'forehead',
    offsetX: 0,
    offsetY: -0.8,
    scaleMultiplier: 1.8,
  },
  {
    id: 'viking-helmet',
    name: 'Mũ Viking',
    icon: '⚔️',
    imageSrc: '/filters/viking-helmet.svg',
    anchor: 'forehead',
    offsetX: 0,
    offsetY: -0.5,
    scaleMultiplier: 2.2,
  },
  {
    id: 'graduation-cap',
    name: 'Mũ tốt nghiệp',
    icon: '🎓',
    imageSrc: '/filters/graduation-cap.svg',
    anchor: 'forehead',
    offsetX: 0,
    offsetY: -0.7,
    scaleMultiplier: 2.2,
  },
  {
    id: 'chef-hat',
    name: 'Mũ đầu bếp',
    icon: '👨‍🍳',
    imageSrc: '/filters/chef-hat.svg',
    anchor: 'forehead',
    offsetX: 0,
    offsetY: -0.8,
    scaleMultiplier: 2.0,
  },
  {
    id: 'pirate-hat',
    name: 'Mũ cướp biển',
    icon: '🏴‍☠️',
    imageSrc: '/filters/pirate-hat.svg',
    anchor: 'forehead',
    offsetX: 0,
    offsetY: -0.6,
    scaleMultiplier: 2.2,
  },
  {
    id: 'headphones',
    name: 'Tai nghe',
    icon: '🎧',
    imageSrc: '/filters/headphones.svg',
    anchor: 'forehead',
    offsetX: 0,
    offsetY: -0.3,
    scaleMultiplier: 2.2,
  },
  {
    id: 'tiara',
    name: 'Vương miện nữ',
    icon: '👸',
    imageSrc: '/filters/tiara.svg',
    anchor: 'forehead',
    offsetX: 0,
    offsetY: -0.6,
    scaleMultiplier: 2.0,
  },
  // --- Glasses & Eyes ---
  {
    id: 'star-glasses',
    name: 'Kính ngôi sao',
    icon: '⭐',
    imageSrc: '/filters/star-glasses.svg',
    anchor: 'eyes',
    offsetX: 0,
    offsetY: 0,
    scaleMultiplier: 1.8,
  },
  {
    id: 'heart-glasses',
    name: 'Kính trái tim',
    icon: '💕',
    imageSrc: '/filters/heart-glasses.svg',
    anchor: 'eyes',
    offsetX: 0,
    offsetY: 0,
    scaleMultiplier: 1.8,
  },
  {
    id: 'nerd-glasses',
    name: 'Kính nerd',
    icon: '🤓',
    imageSrc: '/filters/nerd-glasses.svg',
    anchor: 'eyes',
    offsetX: 0,
    offsetY: 0,
    scaleMultiplier: 1.8,
  },
  {
    id: 'thug-life',
    name: 'Thug Life',
    icon: '😎',
    imageSrc: '/filters/thug-life.svg',
    anchor: 'eyes',
    offsetX: 0,
    offsetY: 0.1,
    scaleMultiplier: 1.8,
  },
  {
    id: 'eye-mask',
    name: 'Mặt nạ',
    icon: '🎭',
    imageSrc: '/filters/eye-mask.svg',
    anchor: 'eyes',
    offsetX: 0,
    offsetY: 0,
    scaleMultiplier: 1.8,
    widthBasis: 'face',
  },
  {
    id: 'laser-eyes',
    name: 'Mắt laser',
    icon: '🔴',
    imageSrc: '/filters/laser-eyes.svg',
    anchor: 'eyes',
    offsetX: 0,
    offsetY: 0,
    scaleMultiplier: 1.8,
  },
  {
    id: 'crying-eyes',
    name: 'Mắt khóc',
    icon: '😢',
    imageSrc: '/filters/crying-eyes.svg',
    anchor: 'eyes',
    offsetX: 0,
    offsetY: 0.1,
    scaleMultiplier: 1.8,
  },
  {
    id: 'spiral-eyes',
    name: 'Mắt xoáy',
    icon: '😵',
    imageSrc: '/filters/spiral-eyes.svg',
    anchor: 'eyes',
    offsetX: 0,
    offsetY: 0,
    scaleMultiplier: 1.8,
  },
  {
    id: 'monocle',
    name: 'Kính một mắt',
    icon: '🧐',
    imageSrc: '/filters/monocle.svg',
    anchor: 'eyes',
    offsetX: 0.3,
    offsetY: 0,
    scaleMultiplier: 1.2,
  },
  {
    id: 'three-d-glasses',
    name: 'Kính 3D',
    icon: '🥽',
    imageSrc: '/filters/three-d-glasses.svg',
    anchor: 'eyes',
    offsetX: 0,
    offsetY: 0,
    scaleMultiplier: 1.8,
  },
  // --- Mouth & Face ---
  {
    id: 'vampire-fangs',
    name: 'Răng ma cà rồng',
    icon: '🧛',
    imageSrc: '/filters/vampire-fangs.svg',
    anchor: 'mouth',
    offsetX: 0,
    offsetY: -0.1,
    scaleMultiplier: 1.4,
  },
  {
    id: 'tongue-out',
    name: 'Lè lưỡi',
    icon: '👅',
    imageSrc: '/filters/tongue-out.svg',
    anchor: 'mouth',
    offsetX: 0,
    offsetY: 0.2,
    scaleMultiplier: 0.8,
  },
  {
    id: 'gold-teeth',
    name: 'Răng vàng',
    icon: '🥇',
    imageSrc: '/filters/gold-teeth.svg',
    anchor: 'mouth',
    offsetX: 0,
    offsetY: 0,
    scaleMultiplier: 1.2,
  },
  {
    id: 'rose-mouth',
    name: 'Ngậm hoa hồng',
    icon: '🌹',
    imageSrc: '/filters/rose-mouth.svg',
    anchor: 'mouth',
    offsetX: 0.1,
    offsetY: 0,
    scaleMultiplier: 1.3,
  },
  {
    id: 'zipper-mouth',
    name: 'Khóa miệng',
    icon: '🤐',
    imageSrc: '/filters/zipper-mouth.svg',
    anchor: 'mouth',
    offsetX: 0,
    offsetY: -0.1,
    scaleMultiplier: 1.2,
  },
  {
    id: 'lips',
    name: 'Đôi môi',
    icon: '💋',
    imageSrc: '/filters/lips.svg',
    anchor: 'mouth',
    offsetX: 0,
    offsetY: -0.1,
    scaleMultiplier: 1.3,
  },
  // --- Full Face Overlays ---
  {
    id: 'skull-face',
    name: 'Đầu lâu',
    icon: '💀',
    imageSrc: '/filters/skull-face.svg',
    anchor: 'face-center',
    offsetX: 0,
    offsetY: 0,
    scaleMultiplier: 2.0,
    widthBasis: 'face',
  },
  {
    id: 'robot-face',
    name: 'Robot',
    icon: '🤖',
    imageSrc: '/filters/robot-face.svg',
    anchor: 'face-center',
    offsetX: 0,
    offsetY: -0.1,
    scaleMultiplier: 2.0,
    widthBasis: 'face',
  },
  {
    id: 'alien-face',
    name: 'Người ngoài hành tinh',
    icon: '👽',
    imageSrc: '/filters/alien-face.svg',
    anchor: 'face-center',
    offsetX: 0,
    offsetY: 0,
    scaleMultiplier: 2.0,
    widthBasis: 'face',
  },
  // --- Decorative Effects ---
  {
    id: 'butterfly',
    name: 'Cánh bướm',
    icon: '🦋',
    imageSrc: '/filters/butterfly.svg',
    anchor: 'forehead',
    offsetX: 0,
    offsetY: -0.5,
    scaleMultiplier: 2.0,
  },
  {
    id: 'rainbow-head',
    name: 'Cầu vồng',
    icon: '🌈',
    imageSrc: '/filters/rainbow-head.svg',
    anchor: 'forehead',
    offsetX: 0,
    offsetY: -0.6,
    scaleMultiplier: 2.4,
  },
  {
    id: 'fire-head',
    name: 'Đầu lửa',
    icon: '🔥',
    imageSrc: '/filters/fire-head.svg',
    anchor: 'forehead',
    offsetX: 0,
    offsetY: -0.8,
    scaleMultiplier: 2.0,
  },
  {
    id: 'snowflakes',
    name: 'Bông tuyết',
    icon: '❄️',
    imageSrc: '/filters/snowflakes.svg',
    anchor: 'forehead',
    offsetX: 0,
    offsetY: -0.5,
    scaleMultiplier: 2.4,
  },
  {
    id: 'sparkles',
    name: 'Lấp lánh',
    icon: '✨',
    imageSrc: '/filters/sparkles.svg',
    anchor: 'forehead',
    offsetX: 0,
    offsetY: -0.5,
    scaleMultiplier: 2.4,
  },
  {
    id: 'blush-cheeks',
    name: 'Má hồng',
    icon: '😊',
    imageSrc: '/filters/blush-cheeks.svg',
    anchor: 'nose',
    offsetX: 0,
    offsetY: 0.1,
    scaleMultiplier: 2.2,
    widthBasis: 'face',
  },
  {
    id: 'face-tattoo',
    name: 'Hình xăm',
    icon: '💫',
    imageSrc: '/filters/face-tattoo.svg',
    anchor: 'eyes',
    offsetX: -0.3,
    offsetY: 0.2,
    scaleMultiplier: 0.8,
  },
  {
    id: 'ninja-mask',
    name: 'Mặt nạ ninja',
    icon: '🥷',
    imageSrc: '/filters/ninja-mask.svg',
    anchor: 'eyes',
    offsetX: 0,
    offsetY: 0.1,
    scaleMultiplier: 2.0,
    widthBasis: 'face',
  },
  // --- Vietnamese & Asian ---
  {
    id: 'non-la',
    name: 'Nón lá',
    icon: '🎋',
    imageSrc: '/filters/non-la.svg',
    anchor: 'forehead',
    offsetX: 0,
    offsetY: -0.6,
    scaleMultiplier: 2.4,
  },
  {
    id: 'dragon-horns',
    name: 'Sừng rồng',
    icon: '🐉',
    imageSrc: '/filters/dragon-horns.svg',
    anchor: 'forehead',
    offsetX: 0,
    offsetY: -0.7,
    scaleMultiplier: 2.2,
  },
  {
    id: 'phoenix-wings',
    name: 'Cánh phượng',
    icon: '🔶',
    imageSrc: '/filters/phoenix-wings.svg',
    anchor: 'forehead',
    offsetX: 0,
    offsetY: -0.5,
    scaleMultiplier: 2.4,
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
