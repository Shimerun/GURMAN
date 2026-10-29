import { cn } from '../../lib/utils';
import ErrorState from '../ui/ErrorState';
import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';

const GRID_CLASS_NAME = 'grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5';

/**
 * @param {{
 *   products: import('../../services/productService').Product[],
 *   isLoading: boolean,
 *   isFetching: boolean,
 *   error: unknown,
 *   onRetry: () => void,
 *   emptyState: import('react').ReactNode,
 *   eagerImageCount?: number,
 *   skeletonCount?: number,
 *   gridClassName?: string,
 * }} props
 */
export default function ProductGrid({
  products,
  isLoading,
  isFetching,
  error,
  onRetry,
  emptyState,
  eagerImageCount = 0,
  skeletonCount = 10,
  gridClassName = GRID_CLASS_NAME,
}) {
  if (isLoading) {
    return (
      <ul className={gridClassName} aria-busy="true" aria-label="Завантаження товарів">
        {Array.from({ length: skeletonCount }, (_, index) => (
          <li key={index}>
            <ProductSkeleton />
          </li>
        ))}
      </ul>
    );
  }

  if (error) return <ErrorState title="Не вдалося завантажити товари" onRetry={onRetry} />;

  if (products.length === 0) return emptyState;

  // Previous results stay visible (dimmed) during refetch to avoid skeleton flicker on every filter change.
  return (
    <ul
      className={cn(gridClassName, 'transition-opacity duration-200', isFetching && 'opacity-60')}
      aria-busy={isFetching}
    >
      {products.map((product, index) => (
        <li key={product.id}>
          <ProductCard product={product} isImageEager={index < eagerImageCount} />
        </li>
      ))}
    </ul>
  );
}
