import { SearchX } from 'lucide-react';
import ListingControls from '../components/products/ListingControls';
import ProductListing from '../components/products/ProductListing';
import EmptyState from '../components/ui/EmptyState';
import PageHeader from '../components/ui/PageHeader';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useProductFilters } from '../hooks/useProductFilters';
import { useProducts } from '../hooks/useProducts';
import { buttonClassName } from '../lib/buttonStyles';

export default function CatalogPage() {
  const filterState = useProductFilters();
  const productsQuery = useProducts(filterState.productParams);
  const { appliedSearch, resetFilters } = filterState;

  useDocumentTitle(appliedSearch ? `Пошук «${appliedSearch}»` : 'Каталог товарів');

  return (
    <>
      <PageHeader
        title="Каталог товарів"
        eyebrow="Усе для дому"
        breadcrumbs={[{ label: 'Каталог' }]}
        description="Понад 70 позицій від перевірених постачальників: свіжі овочі та фрукти, м'ясо, молочні продукти, випічка з власної пекарні та напої."
      />

      <ListingControls filterState={filterState} />

      <ProductListing
        filterState={filterState}
        productsQuery={productsQuery}
        emptyState={
          <EmptyState
            icon={SearchX}
            title={appliedSearch ? `За запитом «${appliedSearch}» нічого не знайдено` : 'Немає товарів за цими фільтрами'}
            description="Перевірте написання, спробуйте коротший запит або скиньте фільтри."
            action={
              <button type="button" onClick={resetFilters} className={buttonClassName()}>
                Скинути пошук і фільтри
              </button>
            }
          />
        }
      />
    </>
  );
}
