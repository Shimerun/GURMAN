import { ArrowRight, PackageOpen } from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { getCatalogPath } from '../../lib/routes';
import ProductGrid from '../products/ProductGrid';
import EmptyState from '../ui/EmptyState';
import SectionHeader from '../ui/SectionHeader';

// Module-level so the query key is stable across renders.
const POPULAR_QUERY = { sort: 'popular', inStockOnly: true };
const MAX_POPULAR_CARDS = 8;
const POPULAR_GRID_CLASS_NAME = 'grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4';

export default function PopularProducts() {
  const { data, isLoading, isFetching, error, refetch } = useProducts(POPULAR_QUERY);
  const popularProducts = useMemo(() => data.slice(0, MAX_POPULAR_CARDS), [data]);

  return (
    <section aria-labelledby="popular-heading">
      <SectionHeader id="popular-heading" eyebrow="Обирають найчастіше" title="Популярні товари">
        <Link
          to={getCatalogPath({ sort: 'popular' })}
          className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-50"
        >
          Дивитися всі
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </SectionHeader>

      <ProductGrid
        products={popularProducts}
        isLoading={isLoading}
        isFetching={isFetching}
        error={error}
        onRetry={refetch}
        skeletonCount={MAX_POPULAR_CARDS}
        gridClassName={POPULAR_GRID_CLASS_NAME}
        emptyState={
          <EmptyState icon={PackageOpen} title="Товари скоро з’являться" description="Ми оновлюємо асортимент — загляньте трохи пізніше." />
        }
      />
    </section>
  );
}
