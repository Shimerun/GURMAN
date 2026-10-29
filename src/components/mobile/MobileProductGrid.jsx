import { useInfiniteChunks } from '../../hooks/useInfiniteChunks';
import { cn } from '../../lib/utils';
import ErrorState from '../ui/ErrorState';
import MobileProductCard from './MobileProductCard';
import MobileProductSkeleton from './MobileProductSkeleton';

const GRID_CLASS_NAME = 'grid grid-cols-2 gap-3';
const EAGER_IMAGE_COUNT = 4;

/**
 * @param {{
 *   products: import('../../services/productService').Product[],
 *   isLoading: boolean,
 *   isFetching: boolean,
 *   error: unknown,
 *   onRetry: () => void,
 *   emptyState: import('react').ReactNode,
 * }} props
 */
export default function MobileProductGrid({ products, isLoading, isFetching, error, onRetry, emptyState }) {
  const { visibleItems, hasMore, sentinelRef } = useInfiniteChunks(products);

  if (isLoading) {
    return (
      <ul className={GRID_CLASS_NAME} aria-busy="true" aria-label="Завантаження товарів">
        {Array.from({ length: 6 }, (_, index) => (
          <li key={index}>
            <MobileProductSkeleton />
          </li>
        ))}
      </ul>
    );
  }

  if (error) return <ErrorState title="Не вдалося завантажити товари" onRetry={onRetry} buttonClassName="min-h-11 active:scale-95" />;

  if (products.length === 0) return emptyState;

  return (
    <>
      <ul className={cn(GRID_CLASS_NAME, 'transition-opacity duration-200', isFetching && 'opacity-60')} aria-busy={isFetching}>
        {visibleItems.map((product, index) => (
          <li key={product.id}>
            <MobileProductCard product={product} isImageEager={index < EAGER_IMAGE_COUNT} />
          </li>
        ))}
      </ul>
      {hasMore && <div ref={sentinelRef} className="h-px" aria-hidden="true" />}
    </>
  );
}
