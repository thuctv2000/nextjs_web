'use client';

import { useState } from 'react';
import type { FaceFilterDefinition } from './filters';

const CATEGORIES = [
  { key: 'all', label: 'Tất cả' },
  { key: 'animal', label: 'Động vật' },
  { key: 'hat', label: 'Mũ' },
  { key: 'glasses', label: 'Kính & Mắt' },
  { key: 'mouth', label: 'Miệng' },
  { key: 'face', label: 'Mặt' },
  { key: 'effect', label: 'Hiệu ứng' },
  { key: 'vn', label: 'Việt Nam' },
] as const;

type CategoryKey = (typeof CATEGORIES)[number]['key'];

const FILTER_CATEGORIES: Record<string, CategoryKey> = {
  // Original
  sunglasses: 'glasses',
  'party-hat': 'hat',
  'dog-filter': 'animal',
  'flower-crown': 'effect',
  mustache: 'mouth',
  'horse-face': 'face',
  // Batch 1
  'cat-ears': 'animal',
  'clown-nose': 'face',
  'angel-halo': 'effect',
  'devil-horns': 'effect',
  'bunny-ears': 'animal',
  crown: 'hat',
  'heart-eyes': 'glasses',
  beard: 'mouth',
  // Animals
  'fox-ears': 'animal',
  'bear-ears': 'animal',
  'pig-nose': 'animal',
  'panda-face': 'animal',
  'frog-eyes': 'animal',
  'mouse-ears': 'animal',
  'deer-antlers': 'animal',
  'lion-mane': 'animal',
  'owl-eyes': 'animal',
  'unicorn-horn': 'animal',
  // Hats
  'cowboy-hat': 'hat',
  'wizard-hat': 'hat',
  'santa-hat': 'hat',
  'top-hat': 'hat',
  'viking-helmet': 'hat',
  'graduation-cap': 'hat',
  'chef-hat': 'hat',
  'pirate-hat': 'hat',
  headphones: 'hat',
  tiara: 'hat',
  // Glasses & Eyes
  'star-glasses': 'glasses',
  'heart-glasses': 'glasses',
  'nerd-glasses': 'glasses',
  'thug-life': 'glasses',
  'eye-mask': 'glasses',
  'laser-eyes': 'glasses',
  'crying-eyes': 'glasses',
  'spiral-eyes': 'glasses',
  monocle: 'glasses',
  'three-d-glasses': 'glasses',
  // Mouth
  'vampire-fangs': 'mouth',
  'tongue-out': 'mouth',
  'gold-teeth': 'mouth',
  'rose-mouth': 'mouth',
  'zipper-mouth': 'mouth',
  lips: 'mouth',
  // Face
  'skull-face': 'face',
  'robot-face': 'face',
  'alien-face': 'face',
  // Effects
  butterfly: 'effect',
  'rainbow-head': 'effect',
  'fire-head': 'effect',
  snowflakes: 'effect',
  sparkles: 'effect',
  'blush-cheeks': 'effect',
  'face-tattoo': 'effect',
  'ninja-mask': 'face',
  // Vietnamese
  'non-la': 'vn',
  'dragon-horns': 'vn',
  'phoenix-wings': 'vn',
};

interface FilterSelectorProps {
  filters: FaceFilterDefinition[];
  selectedFilterId: string | null;
  onSelectFilter: (filterId: string | null) => void;
}

export function FilterSelector({
  filters,
  selectedFilterId,
  onSelectFilter,
}: FilterSelectorProps): React.ReactElement {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('all');

  const filteredFilters =
    activeCategory === 'all'
      ? filters
      : filters.filter((f) => FILTER_CATEGORIES[f.id] === activeCategory);

  return (
    <div className="space-y-2">
      {/* Category tabs */}
      <div className="flex gap-1.5 overflow-x-auto px-2 pb-1 scrollbar-hide">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            type="button"
            onClick={() => setActiveCategory(cat.key)}
            className={`whitespace-nowrap px-3 py-1 rounded-full text-xs font-medium transition-all ${
              activeCategory === cat.key
                ? 'bg-amber-400 text-red-900'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Filter grid */}
      <div className="flex flex-wrap gap-2 overflow-y-auto max-h-[120px] px-2 py-1 scrollbar-hide">
        {/* None button */}
        <button
          type="button"
          aria-label="Không"
          onClick={() => onSelectFilter(null)}
          className={`flex flex-col items-center gap-0.5 w-[52px] p-1.5 rounded-xl border-2 transition-all ${
            selectedFilterId === null
              ? 'border-amber-400 bg-amber-400/20'
              : 'border-white/20 bg-white/10'
          }`}
        >
          <span className="text-xl">🚫</span>
          <span className="text-[9px] text-white/80 leading-tight">Không</span>
        </button>

        {/* Filter buttons */}
        {filteredFilters.map((filter) => (
          <button
            key={filter.id}
            type="button"
            onClick={() => onSelectFilter(filter.id)}
            className={`flex flex-col items-center gap-0.5 w-[52px] p-1.5 rounded-xl border-2 transition-all ${
              selectedFilterId === filter.id
                ? 'border-amber-400 bg-amber-400/20'
                : 'border-white/20 bg-white/10'
            }`}
          >
            <span className="text-xl">{filter.icon}</span>
            <span className="text-[9px] text-white/80 leading-tight truncate w-full text-center">
              {filter.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
