import { Heart } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import ProductGrid from '../components/products/ProductGrid';
import EmptyState from '../components/ui/EmptyState';
import PageHeader from '../components/ui/PageHeader';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { STATIC_PAGE_META } from '../lib/pageMeta';
import { useHasMounted } from '../hooks/useHasMounted';
import { useProductsByIds } from '../hooks/useProducts';
import { buttonClassName } from '../lib/buttonStyles';
import { PRODUCT_FORMS, pluralize } from '../lib/format';
import { ROUTES } from '../lib/routes';
import { useFavoritesStore } from '../store/useFavoritesStore';

const FAVORITES_CRUMBS = [{ label: 'Обране' }];

/** @param {{ productIds: string[] }} props */
function FavoriteProducts({ productIds }) {
  // Un-hearting a card hides it at once instead of refetching the rest.
  const { data: products, isLoading, isFetching, error, refetch } = useProductsByIds(productIds);
  const favoriteIds = new Set(useFavoritesStore((state) => state.productIds));
  const visibleProducts = products.filter((product) => favoriteIds.has(product.id));

  return (
    <ProductGrid
      products={visibleProducts}
      isLoading={isLoading}
      isFetching={isFetching}
      error={error}
      onRetry={refetch}
      skeletonCount={Math.min(productIds.length, 10)}
      emptyState={<FavoritesEmptyState />}
    />
  );
}

function FavoritesEmptyState() {
  return (
    <EmptyState
      icon={Heart}
      title="Тут з'являться улюблені товари"
      headingAs="h2"
      description="Натисніть на сердечко на картці товару — і він збережеться тут, на цьому пристрої."
      className="py-16"
      action={
        <Link to={ROUTES.catalog} className={buttonClassName({ size: 'lg' })}>
          Перейти до каталогу
        </Link>
      }
    />
  );
}

export default function FavoritesPage() {
  const productIds = useFavoritesStore((state) => state.productIds);
  const hasMounted = useHasMounted();
  // Snapshot of the ids on arrival, so removing a favourite here does not trigger a new request.
  const [initialProductIds] = useState(productIds);

  useDocumentTitle(STATIC_PAGE_META.favorites.title, STATIC_PAGE_META.favorites.description);

  if (!hasMounted) return <PageHeader title="Обране" breadcrumbs={FAVORITES_CRUMBS} />;

  return (
    <>
      <PageHeader
        title="Обране"
        breadcrumbs={FAVORITES_CRUMBS}
        description={productIds.length > 0 ? `Збережено ${pluralize(productIds.length, PRODUCT_FORMS)}.` : undefined}
      />
      {productIds.length === 0 ? <FavoritesEmptyState /> : <FavoriteProducts productIds={initialProductIds} />}
    </>
  );
}
