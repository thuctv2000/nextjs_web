import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FilterSelector } from '../FilterSelector';
import { FILTERS } from '../filters';

describe('FilterSelector', () => {
  const onSelectFilter = vi.fn();

  beforeEach(() => {
    onSelectFilter.mockClear();
  });

  describe('Rendering', () => {
    it('renders a "None" option button', () => {
      render(
        <FilterSelector
          filters={FILTERS}
          selectedFilterId={null}
          onSelectFilter={onSelectFilter}
        />,
      );
      expect(screen.getByRole('button', { name: /none|không/i })).toBeInTheDocument();
    });

    it('renders a button for each filter in the array', () => {
      render(
        <FilterSelector
          filters={FILTERS}
          selectedFilterId={null}
          onSelectFilter={onSelectFilter}
        />,
      );
      // "None" button + one per filter
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBe(FILTERS.length + 1);
    });

    it('each filter button shows the filter icon (emoji)', () => {
      render(
        <FilterSelector
          filters={FILTERS}
          selectedFilterId={null}
          onSelectFilter={onSelectFilter}
        />,
      );
      for (const f of FILTERS) {
        expect(screen.getByText(f.icon)).toBeInTheDocument();
      }
    });

    it('each filter button shows the filter name', () => {
      render(
        <FilterSelector
          filters={FILTERS}
          selectedFilterId={null}
          onSelectFilter={onSelectFilter}
        />,
      );
      for (const f of FILTERS) {
        expect(screen.getByText(f.name)).toBeInTheDocument();
      }
    });
  });

  describe('Selection', () => {
    it('clicking a filter calls onSelectFilter with that filter id', () => {
      render(
        <FilterSelector
          filters={FILTERS}
          selectedFilterId={null}
          onSelectFilter={onSelectFilter}
        />,
      );
      const firstFilter = FILTERS[0];
      fireEvent.click(screen.getByText(firstFilter.icon));
      expect(onSelectFilter).toHaveBeenCalledWith(firstFilter.id);
    });

    it('clicking "None" calls onSelectFilter(null)', () => {
      render(
        <FilterSelector
          filters={FILTERS}
          selectedFilterId={FILTERS[0].id}
          onSelectFilter={onSelectFilter}
        />,
      );
      fireEvent.click(screen.getByRole('button', { name: /none|không/i }));
      expect(onSelectFilter).toHaveBeenCalledWith(null);
    });

    it('selected filter has amber border class', () => {
      render(
        <FilterSelector
          filters={FILTERS}
          selectedFilterId={FILTERS[0].id}
          onSelectFilter={onSelectFilter}
        />,
      );
      const selectedBtn = screen.getByText(FILTERS[0].icon).closest('button');
      expect(selectedBtn?.className).toMatch(/border-amber/);
    });

    it('non-selected filters do not have amber border class', () => {
      render(
        <FilterSelector
          filters={FILTERS}
          selectedFilterId={FILTERS[0].id}
          onSelectFilter={onSelectFilter}
        />,
      );
      const nonSelectedBtn = screen.getByText(FILTERS[1].icon).closest('button');
      expect(nonSelectedBtn?.className).not.toMatch(/border-amber/);
    });
  });
});
