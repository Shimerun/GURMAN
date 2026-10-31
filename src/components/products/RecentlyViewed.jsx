import { useMemo, useState } from 'react';
import { useProductsByIds } from '../../hooks/useProducts';
import { buttonClassName } from '../../lib/buttonStyles';
import { useRecentlyViewedStore } from '../../store/useRecentlyViewedStore';
import SectionHeader from '../ui/SectionHeader';
import ProductGrid from './ProductGrid';

const MAX_VISIBLE = 8;
// One swipeable row: fixed card widths keep a short history from stretching across the page.
const ROW_CLASS_NAME =
  'scrollbar-hide -mx-4 grid snap-x snap-mandatory auto-cols-[10.5rem] grid-flow-col gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:auto-cols-[13rem] sm:gap-4 sm:px-0 [&>li]:snap-start';

/**
 * "Ви переглядали": the visitor's own history, stored on this device. Hidden while it is empty.
 * @param {{ excludeProductId?: string, hasImageTransition?: boolean, className?: string }} props
 * `excludeProductId` leaves out the product page being viewed; such pages also pass
 * `hasImageTransition={false}` (their main image owns the shared transition name).
 */
export default function RecentlyViewed({ excludeProductId, hasImageTransition = true, className }) {
  const productIds = useRecentlyViewedStore((state) => state.productIds);
  const clearViewedProducts = useRecentlyViewedStore((state) => state.clearViewedProducts);
  // Snapshot on arrival: opening this very page records a view, which must not trigger a refetch.
  const [initialIds] = useState(() => productIds.filter((id) => id !== excludeProductId).slice(0, MAX_VISIBLE));
  const { data, isLoading, isFetching, error, refetch } = useProductsByIds(initialIds);

  // Memoized: ProductGrid's FLIP effect runs whenever this array changes identity.
  const products = useMemo(() => {
    const currentIds = new Set(productIds);
    return data.filter((product) => currentIds.has(product.id));
  }, [data, productIds]);
  const isEmpty = initialIds.length === 0 || productIds.length === 0 || (!isLoading && !error && products.length === 0);
  if (isEmpty) return null;

  return (
    <section aria-labelledby="recently-viewed-heading" className={className}>
      <SectionHeader id="recently-viewed-heading" eyebrow="Ваша історія" title="Ви переглядали">
        <button type="button" onClick={clearViewedProducts} className={buttonClassName({ variant: 'ghost', size: 'sm' })}>
          Очистити історію
        </button>
      </SectionHeader>
      <ProductGrid
        products={products}
        isLoading={isLoading}
        isFetching={isFetching}
        error={error}
        onRetry={refetch}
        skeletonCount={initialIds.length}
        gridClassName={ROW_CLASS_NAME}
        hasImageTransition={hasImageTransition}
        emptyState={null}
      />
    </section>
  );
}
