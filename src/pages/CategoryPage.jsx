import { PackageCheck, PackageOpen, SearchX } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import ListingControls from '../components/products/ListingControls';
import ProductListing from '../components/products/ProductListing';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';
import NotFoundState from '../components/ui/NotFoundState';
import SafeImage from '../components/ui/SafeImage';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { getCategoryPageMeta } from '../lib/pageMeta';
import { useProductFilters } from '../hooks/useProductFilters';
import { useCategory, useProducts } from '../hooks/useProducts';
import { buttonClassName } from '../lib/buttonStyles';
import { PRODUCT_FORMS, pluralize } from '../lib/format';
import { ROUTES, getCatalogPath } from '../lib/routes';
import { withImageWidth } from '../lib/utils';
import { isNotFoundError } from '../services/simulateNetworkLatency';

/** @typedef {import('../services/productService').Category} Category */

const CATALOG_CRUMB = { label: 'Каталог', to: ROUTES.catalog };

/** @param {{ category: Category }} props */
function CategoryBanner({ category }) {
  return (
    <section aria-labelledby="category-title" className="relative mt-3 overflow-hidden rounded-3xl bg-emerald-900 shadow-soft">
      <SafeImage
        src={withImageWidth(category.image, 1400)}
        alt=""
        isEager
        fetchpriority="high"
        className="absolute inset-0 h-full w-full object-cover opacity-30 md:left-auto md:w-3/5 md:opacity-100"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-emerald-900/90 to-emerald-900/30 md:via-emerald-900 md:via-45% md:to-transparent"
        aria-hidden="true"
      />
      <div className="relative max-w-2xl p-5 text-white sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">Категорія товарів</p>
        <h1 id="category-title" className="mt-1.5 font-display font-display text-xl font-bold tracking-tight sm:text-2xl lg:text-4xl">
          {category.title}
        </h1>
        <p className="mt-2 line-clamp-2 max-w-xl text-sm leading-relaxed text-white sm:mt-3 sm:line-clamp-none sm:text-base">{category.description}</p>
        <ul className="mt-4 flex flex-wrap gap-2 text-sm sm:mt-6">
          <li className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 font-medium backdrop-blur-sm">
            <PackageOpen className="h-4 w-4 text-amber-300" aria-hidden="true" />
            {pluralize(category.productCount, PRODUCT_FORMS)}
          </li>
          <li className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 font-medium backdrop-blur-sm">
            <PackageCheck className="h-4 w-4 text-amber-300" aria-hidden="true" />
            {category.availableCount} в наявності
          </li>
        </ul>
      </div>
    </section>
  );
}

function CategoryBannerSkeleton() {
  return (
    <div aria-busy="true" aria-label="Завантаження категорії">
      <div className="skeleton h-5 w-56 rounded" />
      <div className="skeleton mt-4 h-64 w-full rounded-3xl" />
      <div className="skeleton mt-6 h-12 w-full rounded-2xl" />
    </div>
  );
}

/** @param {{ category: Category }} props */
function CategoryListing({ category }) {
  const filterState = useProductFilters({ categoryId: category.id });
  const productsQuery = useProducts(filterState.productParams);
  const isCategoryEmpty = category.productCount === 0;

  return (
    <>
      <Breadcrumbs items={[CATALOG_CRUMB, { label: category.title }]} />
      <CategoryBanner category={category} />

      <div className="mt-6">
        <ListingControls filterState={filterState} activeCategory={category} />
        <ProductListing
          filterState={filterState}
          productsQuery={productsQuery}
          emptyState={
            isCategoryEmpty ? (
              <EmptyState
                icon={PackageOpen}
                title="У цій категорії поки немає товарів"
                description="Ми вже домовляємося з постачальниками. А поки — перегляньте інші розділи каталогу."
                action={
                  <Link to={ROUTES.catalog} className={buttonClassName()}>
                    До каталогу
                  </Link>
                }
              />
            ) : (
              <EmptyState
                icon={SearchX}
                title="Немає товарів за цими фільтрами"
                description={`У категорії «${category.title}» є ${pluralize(category.productCount, PRODUCT_FORMS)} — спробуйте розширити ціновий діапазон або вимкнути фільтри.`}
                action={
                  <div className="flex flex-wrap justify-center gap-3">
                    <button type="button" onClick={filterState.resetFilters} className={buttonClassName()}>
                      Скинути фільтри
                    </button>
                    {filterState.appliedSearch && (
                      <Link to={getCatalogPath({ search: filterState.appliedSearch })} className={buttonClassName({ variant: 'secondary' })}>
                        Шукати «{filterState.appliedSearch}» в усьому каталозі
                      </Link>
                    )}
                  </div>
                }
              />
            )
          }
        />
      </div>
    </>
  );
}

/** @param {{ categoryId: string }} props */
function CategoryContent({ categoryId }) {
  const { data: category, isLoading, error, refetch } = useCategory(categoryId);
  const isMissing = isNotFoundError(error);

  const categoryMeta = category ? getCategoryPageMeta(category) : undefined;
  useDocumentTitle(categoryMeta?.title ?? (isMissing ? 'Категорію не знайдено' : undefined), categoryMeta?.description);

  if (isLoading) return <CategoryBannerSkeleton />;

  if (isMissing) {
    return (
      <>
        <Breadcrumbs items={[CATALOG_CRUMB, { label: 'Категорію не знайдено' }]} className="mb-6" />
        <NotFoundState
          title="Такої категорії не існує"
          description="Можливо, посилання застаріло або містить помилку. Оберіть категорію в каталозі."
        />
      </>
    );
  }

  if (!category) return <ErrorState title="Не вдалося завантажити категорію" onRetry={refetch} headingAs="h1" />;

  return <CategoryListing category={category} />;
}

export default function CategoryPage() {
  const { categoryId = '' } = useParams();
  // Keyed so switching categories starts with fresh filter state and no stale products.
  return <CategoryContent key={categoryId} categoryId={categoryId} />;
}
