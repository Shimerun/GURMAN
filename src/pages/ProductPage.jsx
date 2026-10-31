import { BadgeCheck, Factory, Globe, RotateCcw, Scale, Store, Tag } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import FavoriteButton from '../components/products/FavoriteButton';
import ProductGrid from '../components/products/ProductGrid';
import ProductPurchasePanel from '../components/products/ProductPurchasePanel';
import RecentlyViewed from '../components/products/RecentlyViewed';
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
import { getProductPageMeta } from '../lib/pageMeta';
import { useProduct, useProducts } from '../hooks/useProducts';
import { FEATURES } from '../config/business';
import { IN_CITY, PROMO_VALID_UNTIL } from '../lib/constants';
import { formatDayMonth, formatPrice, getDiscountPercent } from '../lib/format';
import { ROUTES, getCategoryPath } from '../lib/routes';
import { cn, withImageWidth } from '../lib/utils';
import { isNotFoundError } from '../services/simulateNetworkLatency';
import { useRecentlyViewedStore } from '../store/useRecentlyViewedStore';
import { buttonClassName } from '../lib/buttonStyles';

/** @typedef {import('../services/productService').Product} Product */

const MAX_RECOMMENDATIONS = 4;
const RECOMMENDATIONS_GRID_CLASS_NAME = 'grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4';

const SERVICE_PROMISES = [
  { icon: Store, label: 'Купуйте в магазинах GURMAN' },
  { icon: BadgeCheck, label: 'Перевіряємо кожну партію' },
  { icon: RotateCcw, label: 'Заміна або повернення грошей' },
];

/** @param {{ title: string, children: import('react').ReactNode }} props */
function DetailsSection({ title, children }) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100 sm:p-6">
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      <div className="mt-3 text-sm leading-relaxed text-slate-700">{children}</div>
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
          className={buttonClassName({ variant: 'ghost', size: 'sm' })}
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
        hasImageTransition={false}
        emptyState={null}
      />
    </section>
  );
}

/** @type {Record<import('../services/productService').Unit, string>} */
const UNIT_EXPLANATIONS = {
  кг: 'Ваговий товар: ціна за 1 кг, у кошик додається з кроком 1 кг',
  шт: 'Ціна за 1 штуку',
  л: 'Ціна за 1 літр',
  уп: 'Ціна за 1 упаковку',
};

const PACKAGING_KEY_PATTERN = /^(Маса|Об'єм|Кількість|Вага)/;

/** The packaging line ("Маса: 900 г") from characteristics, when the product has one. @param {Product} product */
const getPackaging = (product) => Object.entries(product.characteristics).find(([label]) => PACKAGING_KEY_PATTERN.test(label));

/** @param {{ product: Product }} props */
function PromoNotice({ product }) {
  const discountPercent = getDiscountPercent(product.price, product.oldPrice);
  if (!product.isPromo || discountPercent === 0) return null;

  return (
    <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-950 ring-1 ring-amber-200">
      <Tag className="h-4 w-4 shrink-0 text-amber-700" aria-hidden="true" />
      <span className="font-bold">Акція −{discountPercent}%</span>
      <span>
        економія {formatPrice((product.oldPrice ?? product.price) - product.price)} на кожному {product.unit} · до {formatDayMonth(PROMO_VALID_UNTIL)}
      </span>
    </p>
  );
}

/** @param {{ product: Product }} props */
function ProductDetails({ product }) {
  const isOutOfStock = product.stockStatus === 'out_of_stock' || product.stockQty <= 0;
  const characteristics = Object.entries(product.characteristics);
  const packaging = getPackaging(product);
  const addViewedProduct = useRecentlyViewedStore((state) => state.addViewedProduct);

  useEffect(() => {
    addViewedProduct(product.id);
  }, [addViewedProduct, product.id]);

  return (
    // Bottom padding on phones keeps the sticky purchase bar from covering the last section.
    <div className="pb-16 md:pb-0">
      <Breadcrumbs
        items={[
          { label: 'Каталог', to: ROUTES.catalog },
          { label: product.categoryTitle, to: getCategoryPath(product.category) },
          { label: product.title },
        ]}
      />

      <div className="mt-4 grid gap-6 lg:mt-6 lg:grid-cols-2 lg:gap-10">
        <div className="lg:sticky lg:top-36 lg:self-start">
          {/* Shared view-transition name: the product card's image morphs into this one. */}
          <div className="relative overflow-clip rounded-3xl bg-emerald-50 shadow-soft ring-1 ring-slate-100 [view-transition-name:product-image]">
            <ProductBadges product={product} className="absolute left-4 top-4 z-[1]" />
            <SafeImage
              src={withImageWidth(product.image, 900)}
              alt={product.title}
              isEager
              fetchpriority="high"
              width={900}
              height={900}
              className={cn('aspect-[4/3] w-full object-cover sm:aspect-square', isOutOfStock && 'opacity-60 grayscale')}
            />
          </div>
        </div>

        <div className="min-w-0">
          <div className="flex items-center justify-between gap-3">
            <Link
              to={getCategoryPath(product.category)}
              className="inline-flex min-h-8 items-center text-sm font-semibold text-emerald-800 underline-offset-4 transition-colors hover:underline"
            >
              {product.categoryTitle}
            </Link>
            <FavoriteButton product={product} isLabeled className="shrink-0" />
          </div>
          <h1 className="mt-1 text-2xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">{product.title}</h1>
          {FEATURES.productRatings && <Rating rating={product.rating} reviewsCount={product.reviewsCount} size="lg" className="mt-3" />}

          <div className="mt-5">
            <PriceTag product={product} size="lg" />
            <PromoNotice product={product} />
          </div>

          <dl className="mt-4 space-y-2 text-sm">
            <div>
              <dt className="sr-only">Наявність</dt>
              <dd className="flex flex-wrap items-center gap-2">
                <StockBadge status={product.stockStatus} />
                {product.stockStatus === 'low_stock' && (
                  <span className="font-medium text-amber-900">
                    Залишилось {product.stockQty} {product.unit}
                  </span>
                )}
                {product.stockStatus === 'in_stock' && <span className="text-slate-600">У магазинах GURMAN {IN_CITY}</span>}
              </dd>
            </div>
            <div className="flex items-start gap-2 text-slate-700">
              <dt className="sr-only">Одиниця продажу</dt>
              <Scale className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" aria-hidden="true" />
              <dd>
                {UNIT_EXPLANATIONS[product.unit]}
                {packaging && (
                  <span className="block font-semibold text-slate-900">
                    {packaging[0]}: {packaging[1]}
                  </span>
                )}
              </dd>
            </div>
          </dl>

          <div className="mt-5">
            <ProductPurchasePanel product={product} />
          </div>

          <dl className="mt-5 grid gap-3 rounded-2xl bg-white p-4 text-sm ring-1 ring-slate-100 sm:grid-cols-2">
            <div className="flex items-start gap-2">
              <Globe className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" aria-hidden="true" />
              <div>
                <dt className="text-slate-600">Походження</dt>
                <dd className="font-semibold text-slate-900">{product.origin}</dd>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Factory className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" aria-hidden="true" />
              <div>
                <dt className="text-slate-600">Виробник</dt>
                <dd className="font-semibold text-slate-900">{product.producer}</dd>
              </div>
            </div>
          </dl>

          <ul className="mt-4 grid gap-2 text-sm text-slate-700 sm:grid-cols-3">
            {SERVICE_PROMISES.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2">
                <Icon className="h-4 w-4 shrink-0 text-emerald-700" aria-hidden="true" />
                {label}
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
        </DetailsSection>

        <DetailsSection title="Зберігання">
          <dl className="space-y-2">
            <div>
              <dt className="font-semibold text-slate-800">Умови</dt>
              <dd>{product.storage.conditions}</dd>
            </div>
            {product.storage.shelfLife && (
              <div>
                <dt className="font-semibold text-slate-800">Термін придатності</dt>
                <dd>{product.storage.shelfLife}</dd>
              </div>
            )}
          </dl>
        </DetailsSection>

        <DetailsSection title="Характеристики">
          <dl className="divide-y divide-slate-100">
            {characteristics.map(([label, value]) => (
              <div key={label} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-4 py-2.5 sm:grid-cols-[12rem_minmax(0,1fr)]">
                <dt className="text-slate-600">{label}</dt>
                <dd className="font-semibold text-slate-900">{value}</dd>
              </div>
            ))}
            <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-4 py-2.5 sm:grid-cols-[12rem_minmax(0,1fr)]">
              <dt className="text-slate-600">Одиниця продажу</dt>
              <dd className="font-semibold text-slate-900">{product.unit}</dd>
            </div>
          </dl>
        </DetailsSection>
      </div>

      <RecommendedProducts product={product} />
      <RecentlyViewed excludeProductId={product.id} hasImageTransition={false} className="mt-12 sm:mt-16" />
    </div>
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

  const productMeta = product ? getProductPageMeta(product) : undefined;
  useDocumentTitle(productMeta?.title ?? (isMissing ? 'Товар не знайдено' : undefined), productMeta?.description);

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

  if (!product) return <ErrorState title="Не вдалося завантажити товар" onRetry={refetch} headingAs="h1" />;

  return <ProductDetails product={product} />;
}

export default function ProductPage() {
  const { productId = '' } = useParams();
  // Keyed so moving between products (e.g. via recommendations) never shows the previous one.
  return <ProductContent key={productId} productId={productId} />;
}
