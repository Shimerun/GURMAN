import { ArrowRight, RefreshCw, Tag } from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { buttonClassName } from '../../lib/buttonStyles';
import { PROMO_LISTING_QUERY, PROMO_VALID_UNTIL } from '../../lib/constants';
import { PRODUCT_FORMS, formatDayMonth, formatPrice, getDiscountPercent, pluralize } from '../../lib/format';
import { getCatalogPath, getProductPath } from '../../lib/routes';
import SafeImage from '../ui/SafeImage';

const MAX_DEALS = 3;

function DealsSkeleton() {
  return (
    <ul className="space-y-3" aria-busy="true" aria-label="Завантаження акцій">
      {Array.from({ length: MAX_DEALS }, (_, index) => (
        <li key={index} className="flex gap-3">
          <div className="skeleton h-14 w-14 shrink-0 rounded-xl sm:h-16 sm:w-16" />
          <div className="flex-1 space-y-2 py-1">
            <div className="skeleton h-4 w-full rounded" />
            <div className="skeleton h-4 w-1/2 rounded" />
          </div>
        </li>
      ))}
    </ul>
  );
}

/** First-screen promo panel: the biggest discounts right now, straight from the promo listing query. */
export default function HeroDeals() {
  const { data, isLoading, error, refetch } = useProducts(PROMO_LISTING_QUERY);
  const deals = useMemo(() => data.slice(0, MAX_DEALS), [data]);

  return (
    <aside aria-labelledby="hero-deals-heading" className="flex flex-col rounded-3xl bg-white p-4 shadow-soft ring-1 ring-amber-200 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="hero-deals-heading" className="flex items-center gap-2 text-base font-bold text-slate-900 sm:text-lg">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-amber-400 text-slate-900">
            <Tag className="h-4 w-4" aria-hidden="true" />
          </span>
          Найбільші знижки тижня
        </h2>
        <p className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-900">до {formatDayMonth(PROMO_VALID_UNTIL)}</p>
      </div>

      <div className="mt-2 flex-1 sm:mt-4">
        {isLoading ? (
          <DealsSkeleton />
        ) : error && deals.length === 0 ? (
          <div role="alert" className="rounded-2xl bg-red-50 p-4 text-sm text-red-900 ring-1 ring-red-100">
            <p className="font-semibold">Не вдалося завантажити акції.</p>
            <button type="button" onClick={refetch} className={buttonClassName({ variant: 'secondary', size: 'sm', className: 'mt-3' })}>
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Спробувати ще раз
            </button>
          </div>
        ) : deals.length === 0 ? (
          <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">Нові акції з’являться найближчим часом — загляньте пізніше.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {deals.map((product) => (
              <li key={product.id}>
                <Link to={getProductPath(product.id)} className="group flex items-center gap-3 rounded-xl py-2.5 transition-colors hover:bg-slate-50 sm:py-3">
                  <span className="relative shrink-0">
                    <SafeImage src={product.image} alt="" width={64} height={64} className="h-14 w-14 rounded-xl bg-emerald-50 object-cover sm:h-16 sm:w-16" />
                    <span className="absolute -left-1.5 -top-1.5 rounded-full bg-amber-400 px-1.5 py-0.5 text-xs font-bold leading-none text-slate-900">
                      −{getDiscountPercent(product.price, product.oldPrice)}%
                    </span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="line-clamp-2 text-sm font-semibold leading-5 text-slate-800 group-hover:text-emerald-800">{product.title}</span>
                    <span className="mt-1 flex flex-wrap items-baseline gap-x-1.5">
                      <span className="font-extrabold tabular-nums text-emerald-700">{formatPrice(product.price)}</span>
                      <span className="text-xs text-slate-500">/ {product.unit}</span>
                      <span className="text-xs tabular-nums text-slate-500 line-through">
                        <span className="sr-only">Звичайна ціна: </span>
                        {formatPrice(product.oldPrice ?? product.price)}
                      </span>
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Link to={getCatalogPath(PROMO_LISTING_QUERY)} className={buttonClassName({ variant: 'secondary', className: 'mt-3 w-full sm:mt-4' })}>
        {data.length > 0 ? `Усі акції · ${pluralize(data.length, PRODUCT_FORMS)}` : 'Усі акції'}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </aside>
  );
}
