import { ArrowRight, Leaf } from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { buttonClassName } from '../../lib/buttonStyles';
import { formatPrice, getDiscountPercent } from '../../lib/format';
import { getCategoryPath, getProductPath } from '../../lib/routes';
import SafeImage from '../ui/SafeImage';

// Same params (and key order) as WeeklyDeals, so both sections share one cached request.
const PROMO_QUERY = { onlyPromo: true, sort: 'discount' };
const SEASONAL_CATEGORY_IDS = new Set(['fruits', 'vegetables']);
const MAX_HIGHLIGHTS = 3;

/** Indexed by `Date#getMonth()`. */
const SEASON_BY_MONTH = ['Зима', 'Зима', 'Весна', 'Весна', 'Весна', 'Літо', 'Літо', 'Літо', 'Осінь', 'Осінь', 'Осінь', 'Зима'];

export default function SeasonalOffers() {
  const { data, isLoading } = useProducts(PROMO_QUERY);
  const season = SEASON_BY_MONTH[new Date().getMonth()];

  // `data` is already sorted by discount, so the first matches are the best deals.
  const seasonalPromos = useMemo(() => data.filter((product) => SEASONAL_CATEGORY_IDS.has(product.category)), [data]);
  const maxDiscount = seasonalPromos.length > 0 ? getDiscountPercent(seasonalPromos[0].price, seasonalPromos[0].oldPrice) : 0;
  const highlights = seasonalPromos.slice(0, MAX_HIGHLIGHTS);

  return (
    <section
      aria-labelledby="seasonal-heading"
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-50 via-orange-50 to-emerald-50 ring-1 ring-amber-100"
    >
      <div className="grid items-center gap-8 p-6 sm:p-10 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
        <div>
          <p className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-800 ring-1 ring-amber-200">
            <Leaf className="h-3.5 w-3.5" aria-hidden="true" />
            {season}: сезонна пропозиція
          </p>
          <h2 id="seasonal-heading" className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {isLoading ? (
              'Сезонні фрукти та овочі за вигідними цінами'
            ) : maxDiscount > 0 ? (
              <>
                Сезонні фрукти та овочі зі знижкою{' '}
                <span className="whitespace-nowrap rounded-xl bg-amber-400 px-2 text-slate-900">до −{maxDiscount}%</span>
              </>
            ) : (
              'Сезонні фрукти та овочі від місцевих фермерів'
            )}
          </h2>
          <p className="mt-3 max-w-lg text-slate-600">
            Збираємо врожай у фермерів Житомирщини та привозимо на полиці за добу. Ціни зі знижкою діють, поки товар є в наявності.
          </p>

          {highlights.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-2" aria-label="Найкращі сезонні знижки">
              {highlights.map((product) => (
                <li key={product.id}>
                  <Link
                    to={getProductPath(product.id)}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm ring-1 ring-slate-200 transition-colors hover:text-emerald-700 hover:ring-emerald-400"
                  >
                    {product.title}
                    <span className="font-semibold text-emerald-700">{formatPrice(product.price)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <Link to={getCategoryPath('fruits', PROMO_QUERY)} className={buttonClassName({ variant: 'accent' })}>
              Фрукти зі знижкою
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link to={getCategoryPath('vegetables', PROMO_QUERY)} className={buttonClassName({ variant: 'secondary' })}>
              Овочі зі знижкою
            </Link>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl shadow-soft">
          <SafeImage
            src="https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=1000&q=70&auto=format"
            alt="Свіжі сезонні овочі на прилавку"
            width={1000}
            height={667}
            className="aspect-[3/2] w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
