import { ArrowRight, Clock, Tag } from 'lucide-react';
import { useMemo } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { PROMO_VALID_UNTIL, SECTION_IDS } from '../../lib/constants';
import { formatDayMonth } from '../../lib/format';
import ProductGrid from '../products/ProductGrid';
import EmptyState from '../ui/EmptyState';
import SectionHeader from '../ui/SectionHeader';

// Module-level so the query key is stable across renders.
const PROMO_QUERY = { onlyPromo: true, sort: 'discount' };
const MAX_PROMO_CARDS = 8;
const PROMO_GRID_CLASS_NAME = 'grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4';

/** @param {{ onShowAll: () => void }} props */
export default function WeeklyDeals({ onShowAll }) {
  const { data, isLoading, isFetching, error, refetch } = useProducts(PROMO_QUERY);
  const promoProducts = useMemo(() => data.slice(0, MAX_PROMO_CARDS), [data]);

  return (
    <section id={SECTION_IDS.promo} aria-labelledby="promo-heading">
      <SectionHeader id="promo-heading" eyebrow="Вигідно" title="Акції тижня">
        <div className="flex flex-wrap items-center gap-3">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 text-sm font-medium text-amber-900">
            <Clock className="h-4 w-4" aria-hidden="true" />
            Діє до {formatDayMonth(PROMO_VALID_UNTIL)}
          </p>
          <button
            type="button"
            onClick={onShowAll}
            className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-50"
          >
            Усі акції
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </SectionHeader>

      <ProductGrid
        products={promoProducts}
        isLoading={isLoading}
        isFetching={isFetching}
        error={error}
        onRetry={refetch}
        eagerImageCount={4}
        skeletonCount={4}
        gridClassName={PROMO_GRID_CLASS_NAME}
        emptyState={
          <EmptyState icon={Tag} title="Нові акції вже незабаром" description="Цього тижня пропозицій немає — загляньте пізніше." />
        }
      />
    </section>
  );
}
