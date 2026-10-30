import { SearchX } from 'lucide-react';
import { Link } from 'react-router-dom';
import ListingControls from '../components/products/ListingControls';
import ProductListing from '../components/products/ProductListing';
import EmptyState from '../components/ui/EmptyState';
import PageHeader from '../components/ui/PageHeader';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useProductFilters } from '../hooks/useProductFilters';
import { useProducts } from '../hooks/useProducts';
import { buttonClassName } from '../lib/buttonStyles';
import { getCatalogPath } from '../lib/routes';

const SEARCH_SUGGESTIONS = ['молоко', 'хліб', 'сир', 'яйця', 'банани'];

export default function CatalogPage() {
  const filterState = useProductFilters();
  const productsQuery = useProducts(filterState.productParams);
  const { appliedSearch, resetFilters } = filterState;

  useDocumentTitle(
    appliedSearch ? `Пошук «${appliedSearch}»` : 'Каталог товарів',
    'Каталог GURMAN у Житомирі: понад 70 товарів із цінами, акціями й наявністю — фрукти, овочі, м’ясо, молочні продукти, випічка та напої.',
  );

  return (
    <>
      <PageHeader
        title="Каталог товарів"
        eyebrow="Ціни магазинів GURMAN у Житомирі"
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
