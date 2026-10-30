import { BadgeCheck, Factory, Globe, Leaf, RotateCcw } from 'lucide-react';
import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductGrid from '../components/products/ProductGrid';
import ProductPurchasePanel from '../components/products/ProductPurchasePanel';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import ErrorState from '../components/ui/ErrorState';
import NotFoundState from '../components/ui/NotFoundState';
import PriceTag from '../components/ui/PriceTag';
import ProductBadges from '../components/ui/ProductBadges';
import Rating from '../components/ui/Rating';
import SafeImage from '../components/ui/SafeImage';
import SectionHeader from '../components/ui/SectionHeader';
import StockBadge from '../components/ui/StockBadge';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useProduct, useProducts } from '../hooks/useProducts';
import { ROUTES, getCategoryPath } from '../lib/routes';
import { cn, withImageWidth } from '../lib/utils';
import { isNotFoundError } from '../services/simulateNetworkLatency';

/** @typedef {import('../services/productService').Product} Product */

const MAX_RECOMMENDATIONS = 4;
const RECOMMENDATIONS_GRID_CLASS_NAME = 'grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4';

const SERVICE_PROMISES = [
  { icon: Leaf, title: 'Свіжість щодня', description: 'Оновлюємо вітрину щоранку' },
  { icon: BadgeCheck, title: 'Гарантія якості', description: 'Перевіряємо кожну партію' },
  { icon: RotateCcw, title: 'Легке повернення', description: 'Замінимо або повернемо гроші' },
];

/** @param {{ title: string, children: import('react').ReactNode }} props */
function DetailsSection({ title, children }) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100 sm:p-6">
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      <div className="mt-3 text-sm leading-relaxed text-slate-600">{children}</div>
    </section>
  );
}

/** @param {{ product: Product }} props */
function RecommendedProducts({ product }) {
  const { data, isLoading, isFetching, error, refetch } = useProducts({ category: product.category, sort: 'popular' });
  const recommendations = useMemo(
    () => data.filter((candidate) => candidate.id !== product.id).slice(0, MAX_RECOMMENDATIONS),
    [data, product.id],
  );

  if (!isLoading && !error && recommendations.length === 0) return null;

  return (
    <section aria-labelledby="recommended-heading" className="mt-12 sm:mt-16">
      <SectionHeader id="recommended-heading" eyebrow="Вам також сподобається" title="Рекомендовані товари">
        <Link
          to={getCategoryPath(product.category)}
          className="rounded-full px-3 py-1.5 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-50"
        >
          Усі «{product.categoryTitle}»
        </Link>
      </SectionHeader>
      <ProductGrid
        products={recommendations}
        isLoading={isLoading}
        isFetching={isFetching}
        error={error}
        onRetry={refetch}
        skeletonCount={MAX_RECOMMENDATIONS}
        gridClassName={RECOMMENDATIONS_GRID_CLASS_NAME}
        emptyState={null}
      />
    </section>
  );
}

/** @param {{ product: Product }} props */
function ProductDetails({ product }) {
  const isOutOfStock = product.stockStatus === 'out_of_stock' || product.stockQty <= 0;
  const characteristics = Object.entries(product.characteristics);

  return (
    <>
      <Breadcrumbs
        items={[
          { label: 'Каталог', to: ROUTES.catalog },
          { label: product.categoryTitle, to: getCategoryPath(product.category) },
          { label: product.title },
        ]}
      />

      <div className="mt-6 grid gap-6 lg:grid-cols-2 lg:gap-10">
        <div className="lg:sticky lg:top-36 lg:self-start">
          <div className="relative overflow-hidden rounded-3xl bg-emerald-50 shadow-soft ring-1 ring-slate-100">
            <ProductBadges badges={product.badges} className="absolute left-4 top-4 z-[1]" />
            <SafeImage
              src={withImageWidth(product.image, 900)}
              alt={product.title}
              isEager
              fetchpriority="high"
              width={900}
              height={900}
              className={cn('aspect-square w-full object-cover', isOutOfStock && 'opacity-60 grayscale')}
            />
          </div>
        </div>

        <div className="min-w-0">
          <Link
            to={getCategoryPath(product.category)}
            className="text-sm font-semibold text-emerald-700 transition-colors hover:text-emerald-800 hover:underline"
          >
            {product.categoryTitle}
          </Link>
          <h1 className="mt-2 text-2xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
            {product.title}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
            <Rating rating={product.rating} reviewsCount={product.reviewsCount} size="lg" />
            <StockBadge status={product.stockStatus} />
          </div>

          <PriceTag product={product} size="lg" className="mt-5" />
          <p className="mt-1 text-sm text-slate-500">Ціна вказана за 1 {product.unit}</p>

          <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
            <div className="flex items-start gap-2">
              <Globe className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
              <div>
                <dt className="text-slate-500">Походження</dt>
                <dd className="font-medium text-slate-800">{product.origin}</dd>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Factory className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
              <div>
                <dt className="text-slate-500">Виробник</dt>
                <dd className="font-medium text-slate-800">{product.producer}</dd>
              </div>
            </div>
          </dl>

          <div className="mt-6">
            <ProductPurchasePanel product={product} />
          </div>

          <ul className="mt-6 grid gap-3 sm:grid-cols-3">
            {SERVICE_PROMISES.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex items-start gap-2.5 rounded-2xl bg-white p-3 ring-1 ring-slate-100">
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
                <span>
                  <span className="block text-sm font-semibold text-slate-800">{title}</span>
                  <span className="block text-xs text-slate-500">{description}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-2">
        <DetailsSection title="Опис">
          <p>{product.description}</p>
        </DetailsSection>

        <DetailsSection title={product.ingredients ? 'Склад' : 'Про продукт'}>
          <p>{product.ingredients ?? 'Свіжий продукт без обробки та добавок. Перед вживанням рекомендуємо промити під проточною водою.'}</p>
          <p className="mt-3">
            <span className="font-medium text-slate-800">Походження:</span> {product.origin}.{' '}
            <span className="font-medium text-slate-800">Виробник:</span> {product.producer}.
          </p>
        </DetailsSection>

        <DetailsSection title="Зберігання">
          <dl className="space-y-2">
            <div>
              <dt className="font-medium text-slate-800">Умови</dt>
              <dd>{product.storage.conditions}</dd>
            </div>
            {product.storage.shelfLife && (
              <div>
                <dt className="font-medium text-slate-800">Термін придатності</dt>
                <dd>{product.storage.shelfLife}</dd>
              </div>
            )}
          </dl>
        </DetailsSection>

        <div>
          <DetailsSection title="Характеристики">
            <dl className="divide-y divide-slate-100">
              {characteristics.map(([label, value]) => (
                <div key={label} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-4 py-2.5 sm:grid-cols-[14rem_minmax(0,1fr)]">
                  <dt className="text-slate-500">{label}</dt>
                  <dd className="font-medium text-slate-800">{value}</dd>
                </div>
              ))}
              <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-4 py-2.5 sm:grid-cols-[14rem_minmax(0,1fr)]">
                <dt className="text-slate-500">Одиниця продажу</dt>
                <dd className="font-medium text-slate-800">{product.unit}</dd>
              </div>
            </dl>
          </DetailsSection>
        </div>
      </div>

      <RecommendedProducts product={product} />
    </>
  );
}

function ProductPageSkeleton() {
  return (
    <div aria-busy="true" aria-label="Завантаження товару">
      <div className="skeleton h-5 w-72 max-w-full rounded" />
      <div className="mt-6 grid gap-6 lg:grid-cols-2 lg:gap-10">
        <div className="skeleton aspect-square w-full rounded-3xl" />
        <div>
          <div className="skeleton h-4 w-32 rounded" />
          <div className="skeleton mt-3 h-9 w-full rounded" />
          <div className="skeleton mt-2 h-9 w-2/3 rounded" />
          <div className="skeleton mt-5 h-5 w-48 rounded" />
          <div className="skeleton mt-6 h-10 w-40 rounded" />
          <div className="skeleton mt-6 h-36 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

/** @param {{ productId: string }} props */
function ProductContent({ productId }) {
  const { data: product, isLoading, error, refetch } = useProduct(productId);
  const isMissing = isNotFoundError(error);

  useDocumentTitle(product?.title ?? (isMissing ? 'Товар не знайдено' : undefined));

  if (isLoading) return <ProductPageSkeleton />;

  if (isMissing) {
    return (
      <>
        <Breadcrumbs items={[{ label: 'Каталог', to: ROUTES.catalog }, { label: 'Товар не знайдено' }]} className="mb-6" />
        <NotFoundState
          title="Товар не знайдено"
          description="Можливо, його вже немає в асортименті або посилання містить помилку. Подивіться схожі товари в каталозі."
        />
      </>
    );
  }

  if (!product) return <ErrorState title="Не вдалося завантажити товар" onRetry={refetch} />;

  return <ProductDetails product={product} />;
}

export default function ProductPage() {
  const { productId = '' } = useParams();
  // Keyed so moving between products (e.g. via recommendations) never shows the previous one.
  return <ProductContent key={productId} productId={productId} />;
}
