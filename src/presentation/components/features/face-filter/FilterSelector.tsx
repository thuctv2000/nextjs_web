'use client';

import type { FaceFilterDefinition } from './filters';

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
  return (
    <div className="flex gap-3 overflow-x-auto px-4 py-2 scrollbar-hide">
      {/* None button */}
      <button
        type="button"
        aria-label="Không"
        onClick={() => onSelectFilter(null)}
        className={`flex flex-col items-center gap-1 min-w-[60px] p-2 rounded-xl border-2 transition-all ${
          selectedFilterId === null
            ? 'border-amber-400 bg-amber-400/20'
            : 'border-white/20 bg-white/10'
        }`}
      >
        <span className="text-2xl">🚫</span>
        <span className="text-[10px] text-white/80">Không</span>
      </button>

      {/* Filter buttons */}
      {filters.map((filter) => (
        <button
          key={filter.id}
          type="button"
          onClick={() => onSelectFilter(filter.id)}
          className={`flex flex-col items-center gap-1 min-w-[60px] p-2 rounded-xl border-2 transition-all ${
            selectedFilterId === filter.id
              ? 'border-amber-400 bg-amber-400/20'
              : 'border-white/20 bg-white/10'
          }`}
        >
          <span className="text-2xl">{filter.icon}</span>
          <span className="text-[10px] text-white/80">{filter.name}</span>
        </button>
      ))}
    </div>
  );
}
