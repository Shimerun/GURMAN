import { PRODUCT_FORMS, pluralize } from '../../../lib/format';
import { cn } from '../../../lib/utils';
import BottomSheet from '../BottomSheet';

const SORT_CHOICES = [
  { value: '', label: 'За замовчуванням' },
  { value: 'price_asc', label: 'Ціна ↑' },
  { value: 'price_desc', label: 'Ціна ↓' },
  { value: 'discount', label: 'Найбільша знижка' },
];

const ROW_CLASS_NAME = 'flex min-h-12 cursor-pointer items-center justify-between gap-4 rounded-2xl px-1 text-base text-slate-800';

/**
 * Filters apply live; the footer CTA only closes the sheet, showing the up-to-date result count.
 * @param {{
 *   filters: import('../../../hooks/useCatalogFilters').CatalogFilters,
 *   onFilterChange: (name: string, value: unknown) => void,
 *   onReset: () => void,
 *   resultCount: number,
 *   isCounting: boolean,
 *   onClose: () => void,
 * }} props
 */
export default function FiltersSheet({ filters, onFilterChange, onReset, resultCount, isCounting, onClose }) {
  return (
    <BottomSheet
      title="Фільтри"
      onClose={onClose}
      footer={
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onReset}
            className="min-h-12 rounded-full px-5 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 active:scale-95"
          >
            Скинути
          </button>
          <button
            type="button"
            onClick={onClose}
            className="min-h-12 flex-1 rounded-full bg-emerald-600 px-5 text-sm font-semibold text-white shadow-sm active:scale-95"
          >
            {isCounting ? 'Показати товари' : `Показати ${pluralize(resultCount, PRODUCT_FORMS)}`}
          </button>
        </div>
      }
    >
      <div className="divide-y divide-slate-100">
        <label className={ROW_CLASS_NAME}>
          Тільки акції
          <input
            type="checkbox"
            className="toggle toggle-primary"
            checked={filters.onlyPromo}
            onChange={(event) => onFilterChange('onlyPromo', event.target.checked)}
          />
        </label>
        <label className={ROW_CLASS_NAME}>
          В наявності
          <input
            type="checkbox"
            className="toggle toggle-primary"
            checked={filters.inStockOnly}
            onChange={(event) => onFilterChange('inStockOnly', event.target.checked)}
          />
        </label>
      </div>

      <fieldset className="mt-5">
        <legend className="text-xs font-semibold uppercase tracking-wider text-slate-500">Сортування</legend>
        <div className="mt-2 space-y-1">
          {SORT_CHOICES.map((choice) => (
            <label
              key={choice.value || 'default'}
              className={cn(ROW_CLASS_NAME, 'px-3', filters.sort === choice.value && 'bg-emerald-50 font-medium text-emerald-800')}
            >
              {choice.label}
              <input
                type="radio"
                name="mobile-sort"
                className="radio-primary radio"
                value={choice.value}
                checked={filters.sort === choice.value}
                onChange={() => onFilterChange('sort', choice.value)}
              />
            </label>
          ))}
        </div>
      </fieldset>
    </BottomSheet>
  );
}
