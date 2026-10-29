import { Store as StoreIcon } from 'lucide-react';
import { useStores } from '../../hooks/useStores';
import { CITIES, DEFAULT_CITY, SECTION_IDS } from '../../lib/constants';
import { STORE_FORMS, pluralize } from '../../lib/format';
import { cn } from '../../lib/utils';
import { useCartStore } from '../../store/useCartStore';
import EmptyState from '../ui/EmptyState';
import ErrorState from '../ui/ErrorState';
import FilterPill from '../ui/FilterPill';
import SectionHeader from '../ui/SectionHeader';
import StoreCard from '../ui/StoreCard';

const STORE_GRID_CLASS_NAME = 'grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3';

function StoresContent({ city, onCityChange }) {
  const { data: stores, isLoading, isFetching, error, refetch } = useStores({ city });

  if (isLoading) {
    return (
      <ul className={STORE_GRID_CLASS_NAME} aria-busy="true" aria-label="Завантаження магазинів">
        {Array.from({ length: 3 }, (_, index) => (
          <li key={index} className="skeleton h-40 rounded-2xl" />
        ))}
      </ul>
    );
  }

  if (error) return <ErrorState title="Не вдалося завантажити магазини" onRetry={refetch} />;

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
            className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            Показати магазини: {DEFAULT_CITY}
          </button>
        }
      />
    );
  }

  return (
    <>
      <p className="mb-3 text-sm text-slate-500" aria-live="polite">
        {city}: {pluralize(stores.length, STORE_FORMS)}
      </p>
      <ul className={cn(STORE_GRID_CLASS_NAME, 'transition-opacity duration-200', isFetching && 'opacity-60')} aria-busy={isFetching}>
        {stores.map((store) => (
          <li key={store.id}>
            <StoreCard store={store} />
          </li>
        ))}
      </ul>
    </>
  );
}

export default function StoresBlock() {
  const city = useCartStore((state) => state.city);
  const setCity = useCartStore((state) => state.setCity);

  return (
    <section id={SECTION_IDS.stores} aria-labelledby="stores-heading">
      <SectionHeader id="stores-heading" eyebrow="Поруч із вами" title="Магазини GURMAN" />

      <ul aria-label="Місто" className="scrollbar-hide -mx-4 mb-5 flex snap-x gap-2 overflow-x-auto px-4 py-1 sm:mx-0 sm:px-0">
        {CITIES.map((cityName) => (
          <li key={cityName} className="shrink-0">
            <FilterPill isActive={city === cityName} onClick={() => setCity(cityName)}>
              {cityName}
            </FilterPill>
          </li>
        ))}
      </ul>

      <StoresContent city={city} onCityChange={setCity} />
    </section>
  );
}
