import { useId, useState } from 'react';
import { buttonClassName } from '../../lib/buttonStyles';
import FilterPill from '../ui/FilterPill';

const PRICE_PRESETS = [
  { label: 'До ₴50', min: undefined, max: 50 },
  { label: '₴50–150', min: 50, max: 150 },
  { label: '₴150–500', min: 150, max: 500 },
  { label: 'Від ₴500', min: 500, max: undefined },
];

const INPUT_CLASS_NAME =
  'mt-1 block h-11 w-full min-w-0 rounded-xl border border-slate-300 bg-white px-3 text-base tabular-nums sm:text-sm text-slate-800 transition-colors placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20';

/** @param {string} value @returns {number | undefined} */
function parsePriceInput(value) {
  if (value.trim() === '') return undefined;
  const price = Number(value);
  return Number.isFinite(price) && price >= 0 ? Math.round(price) : undefined;
}

/**
 * Inputs are local until applied, so typing doesn't refetch on every keystroke.
 * Callers remount it (via `key`) when the applied range changes from outside.
 * @param {{
 *   minPrice: number | undefined,
 *   maxPrice: number | undefined,
 *   onApply: (minPrice: number | undefined, maxPrice: number | undefined) => void,
 * }} props
 */
export default function PriceRangeFilter({ minPrice, maxPrice, onApply }) {
  const [minInput, setMinInput] = useState(minPrice === undefined ? '' : String(minPrice));
  const [maxInput, setMaxInput] = useState(maxPrice === undefined ? '' : String(maxPrice));
  const fieldId = useId();

  const handleSubmit = (event) => {
    event.preventDefault();
    const min = parsePriceInput(minInput);
    const max = parsePriceInput(maxInput);
    if (min !== undefined && max !== undefined && min > max) onApply(max, min);
    else onApply(min, max);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <label htmlFor={`${fieldId}-min`} className="flex-1 text-xs font-medium text-slate-600">
          Від, ₴
          <input
            id={`${fieldId}-min`}
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="0"
            value={minInput}
            onChange={(event) => setMinInput(event.target.value)}
            className={INPUT_CLASS_NAME}
          />
        </label>
        <span className="pb-3 text-slate-500" aria-hidden="true">
          –
        </span>
        <label htmlFor={`${fieldId}-max`} className="flex-1 text-xs font-medium text-slate-600">
          До, ₴
          <input
            id={`${fieldId}-max`}
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="1000"
            value={maxInput}
            onChange={(event) => setMaxInput(event.target.value)}
            className={INPUT_CLASS_NAME}
          />
        </label>
        <button type="submit" className={buttonClassName({ size: 'sm', variant: 'secondary', className: 'shrink-0' })}>
          OK
          <span className="sr-only">: застосувати фільтр ціни</span>
        </button>
      </form>

      <ul className="mt-3 flex flex-wrap gap-2" aria-label="Швидкий вибір ціни">
        {PRICE_PRESETS.map((preset) => (
          <li key={preset.label}>
            <FilterPill
              isActive={preset.min === minPrice && preset.max === maxPrice}
              onClick={() => onApply(preset.min, preset.max)}
              size="sm"
            >
              {preset.label}
            </FilterPill>
          </li>
        ))}
      </ul>
    </div>
  );
}
