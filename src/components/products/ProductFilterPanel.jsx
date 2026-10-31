import { RotateCcw } from 'lucide-react';
import { buttonClassName } from '../../lib/buttonStyles';
import PriceRangeFilter from './PriceRangeFilter';

/** @param {{ title: string, children: import('react').ReactNode }} props */
function FilterSection({ title, children }) {
  return (
    <fieldset className="border-t border-slate-100 pt-4 first:border-t-0 first:pt-0">
      <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-600">{title}</legend>
      {children}
    </fieldset>
  );
}

/** @param {{ label: string, description: string, isChecked: boolean, onChange: (isChecked: boolean) => void }} props */
function ToggleRow({ label, description, isChecked, onChange }) {
  return (
    <label className="flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-lg py-1">
      <span>
        <span className="block text-sm font-medium text-slate-800">{label}</span>
        <span className="block text-xs text-slate-600">{description}</span>
      </span>
      <input
        type="checkbox"
        className="toggle toggle-primary shrink-0"
        checked={isChecked}
        onChange={(event) => onChange(event.target.checked)}
      />
    </label>
  );
}

/**
 * Filter options shared by the desktop sidebar and the mobile bottom sheet. Changes apply immediately.
 * @param {{ filterState: import('../../hooks/useProductFilters').ProductFiltersState }} props
 */
export default function ProductFilterPanel({ filterState }) {
  const { filters, setPriceRange, setInStockOnly, setOnlyPromo, resetFilters, hasActiveFilters } = filterState;

  return (
    <div className="space-y-4">
      <FilterSection title="Ціна">
        <PriceRangeFilter
          key={`${filters.minPrice ?? ''}-${filters.maxPrice ?? ''}`}
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          onApply={setPriceRange}
        />
      </FilterSection>

      <FilterSection title="Наявність">
        <ToggleRow
          label="Лише в наявності"
          description="Приховати товари, яких зараз немає"
          isChecked={filters.inStockOnly}
          onChange={setInStockOnly}
        />
      </FilterSection>

      <FilterSection title="Пропозиції">
        <ToggleRow label="Тільки акції" description="Товари зі знижкою цього тижня" isChecked={filters.onlyPromo} onChange={setOnlyPromo} />
      </FilterSection>

      {hasActiveFilters && (
        <button type="button" onClick={resetFilters} className={buttonClassName({ variant: 'ghost', size: 'sm', className: 'w-full' })}>
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Скинути всі фільтри
        </button>
      )}
    </div>
  );
}
