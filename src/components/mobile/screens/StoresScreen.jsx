import { Navigation, Phone, Store as StoreIcon } from 'lucide-react';
import { useStores } from '../../../hooks/useStores';
import { CITIES, DEFAULT_CITY } from '../../../lib/constants';
import { STORE_FORMS, pluralize } from '../../../lib/format';
import { cn } from '../../../lib/utils';
import { useCartStore } from '../../../store/useCartStore';
import EmptyState from '../../ui/EmptyState';
import ErrorState from '../../ui/ErrorState';
import FilterPill from '../../ui/FilterPill';
import StoreCard from '../../ui/StoreCard';

/** @param {import('../../../services/storeService').Store} store */
const getDirectionsUrl = (store) => `https://maps.google.com/?q=${encodeURIComponent(`${store.city}, ${store.address}`)}`;

function StoreList({ city, onCityChange }) {
  const { data: stores, isLoading, isFetching, error, refetch } = useStores({ city });

  if (isLoading) {
    return (
      <ul className="space-y-3" aria-busy="true" aria-label="Завантаження магазинів">
        {Array.from({ length: 3 }, (_, index) => (
          <li key={index} className="skeleton h-48 rounded-2xl" />
        ))}
      </ul>
    );
  }

  if (error) return <ErrorState title="Не вдалося завантажити магазини" onRetry={refetch} buttonClassName="min-h-11 active:scale-95" />;

  if (stores.length === 0) {
    return (
      <EmptyState
        icon={StoreIcon}
        title={`У місті ${city} магазинів GURMAN поки немає`}
        description="Ми вже працюємо над відкриттям. А поки — замовляйте доставку онлайн."
        action={
          <button
            type="button"
            onClick={() => onCityChange(DEFAULT_CITY)}
            className="min-h-11 rounded-full bg-emerald-600 px-5 text-sm font-semibold text-white active:scale-95"
          >
            Показати магазини: {DEFAULT_CITY}
          </button>
        }
      />
    );
  }

  return (
    <>
      <p className="mb-2 text-sm text-slate-500" aria-live="polite">
        {city}: {pluralize(stores.length, STORE_FORMS)}
      </p>
      <ul className={cn('space-y-3 transition-opacity duration-200', isFetching && 'opacity-60')} aria-busy={isFetching}>
        {stores.map((store) => (
          <li key={store.id}>
            <StoreCard store={store}>
              <div className="mt-4 flex gap-2">
                <a
                  href={getDirectionsUrl(store)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 text-sm font-semibold text-white active:scale-95"
                >
                  <Navigation className="h-4 w-4" aria-hidden="true" />
                  Маршрут
                  <span className="sr-only"> (відкриється в новій вкладці)</span>
                </a>
                {/* The inline phone link in StoreCard is too small to tap reliably. */}
                <a
                  href={`tel:${store.phone.replace(/\s/g, '')}`}
                  aria-label={`Подзвонити в ${store.name}`}
                  className="grid min-h-11 min-w-11 place-items-center rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100 active:scale-95"
                >
                  <Phone className="h-5 w-5" aria-hidden="true" />
                </a>
              </div>
            </StoreCard>
          </li>
        ))}
      </ul>
    </>
  );
}

export default function StoresScreen() {
  const city = useCartStore((state) => state.city);
  const setCity = useCartStore((state) => state.setCity);

  return (
    <div className="px-4 pt-4">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Магазини</h1>

      <ul aria-label="Місто" className="scrollbar-hide -mx-4 my-4 flex snap-x snap-mandatory scroll-px-4 gap-2 overflow-x-auto px-4">
        {CITIES.map((cityName) => (
          <li key={cityName} className="shrink-0">
            <FilterPill isActive={city === cityName} onClick={() => setCity(cityName)} className="min-h-11 active:scale-95">
              {cityName}
            </FilterPill>
          </li>
        ))}
      </ul>

      <StoreList city={city} onCityChange={setCity} />
    </div>
  );
}
