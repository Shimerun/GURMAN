import { SearchX } from 'lucide-react';
import { Link } from 'react-router-dom';
import ListingControls from '../components/products/ListingControls';
import ProductListing from '../components/products/ProductListing';
import EmptyState from '../components/ui/EmptyState';
import PageHeader from '../components/ui/PageHeader';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { STATIC_PAGE_META } from '../lib/pageMeta';
import { useProductFilters } from '../hooks/useProductFilters';
import { useProducts } from '../hooks/useProducts';
import { buttonClassName } from '../lib/buttonStyles';
import { SEARCH_SUGGESTIONS } from '../lib/constants';
import { getCatalogPath } from '../lib/routes';

export default function CatalogPage() {
  const filterState = useProductFilters();
  const productsQuery = useProducts(filterState.productParams);
  const { appliedSearch, resetFilters } = filterState;

  useDocumentTitle(appliedSearch ? `Пошук «${appliedSearch}»` : STATIC_PAGE_META.catalog.title, STATIC_PAGE_META.catalog.description);

  return (
    <>
      <PageHeader
        title="Каталог товарів"
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
            description="Перевірте написання, спробуйте коротший запит або скиньте фільтри. Можливо, вас цікавить:"
            action={
              <div className="flex flex-col items-center gap-4">
                <ul className="flex flex-wrap justify-center gap-2" aria-label="Популярні запити">
                  {SEARCH_SUGGESTIONS.map((suggestion) => (
                    <li key={suggestion}>
                      <Link to={getCatalogPath({ search: suggestion })} className={buttonClassName({ variant: 'secondary', size: 'sm' })}>
                        {suggestion}
                      </Link>
                    </li>
                  ))}
                </ul>
                <button type="button" onClick={resetFilters} className={buttonClassName()}>
                  Скинути пошук і фільтри
                </button>
              </div>
            }
          />
        }
      />
    </>
  );
}
