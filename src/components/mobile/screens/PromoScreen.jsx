import { Clock, Tag } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useProducts } from '../../../hooks/useProducts';
import { PROMO_VALID_UNTIL } from '../../../lib/constants';
import { formatDayMonth } from '../../../lib/format';
import EmptyState from '../../ui/EmptyState';
import FilterPill from '../../ui/FilterPill';
import MobileProductGrid from '../MobileProductGrid';

const SORT_CHIPS = [
  { value: 'discount', label: 'За знижкою' },
  { value: 'price_asc', label: 'За ціною' },
];

export default function PromoScreen() {
  const [sort, setSort] = useState(SORT_CHIPS[0].value);
  const query = useMemo(() => ({ onlyPromo: true, sort }), [sort]);
  const { data, isLoading, isFetching, error, refetch } = useProducts(query);

  return (
    <div className="px-4 pt-4">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Акції тижня</h1>
      <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 text-sm font-medium text-amber-900">
        <Clock className="h-4 w-4" aria-hidden="true" />
        Діє до {formatDayMonth(PROMO_VALID_UNTIL)}
      </p>

      <div role="group" aria-label="Сортування акцій" className="scrollbar-hide -mx-4 my-4 flex snap-x snap-mandatory scroll-px-4 gap-2 overflow-x-auto px-4">
        {SORT_CHIPS.map((chip) => (
          <FilterPill key={chip.value} isActive={sort === chip.value} onClick={() => setSort(chip.value)} className="min-h-11 active:scale-95">
            {chip.label}
          </FilterPill>
        ))}
      </div>

      <MobileProductGrid
        products={data}
        isLoading={isLoading}
        isFetching={isFetching}
        error={error}
        onRetry={refetch}
        emptyState={<EmptyState icon={Tag} title="Нові акції вже незабаром" description="Цього тижня пропозицій немає — загляньте пізніше." />}
      />
    </div>
  );
}
