import { Store as StoreIcon } from 'lucide-react';
import { useStores } from '../../hooks/useStores';
import { IN_CITY, SECTION_IDS } from '../../lib/constants';
import { STORE_FORMS, pluralize } from '../../lib/format';
import EmptyState from '../ui/EmptyState';
import ErrorState from '../ui/ErrorState';
import SectionHeader from '../ui/SectionHeader';
import StoreCard from '../ui/StoreCard';

const STORE_GRID_CLASS_NAME = 'grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4';

function StoresContent() {
  const { data: stores, isLoading, error, refetch } = useStores();

  if (isLoading) {
    return (
      <ul className={STORE_GRID_CLASS_NAME} aria-busy="true" aria-label="Завантаження магазинів">
        {Array.from({ length: 4 }, (_, index) => (
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
        title="Список магазинів оновлюється"
        description="Зателефонуйте на гарячу лінію — підкажемо найближчий магазин."
      />
    );
  }

  return (
    <>
      <p className="mb-3 text-sm text-slate-500">{pluralize(stores.length, STORE_FORMS)}</p>
      <ul className={STORE_GRID_CLASS_NAME}>
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
  return (
    <section id={SECTION_IDS.stores} aria-labelledby="stores-heading">
      <SectionHeader id="stores-heading" eyebrow="Поруч із вами" title={`Магазини GURMAN ${IN_CITY}`} />
      <StoresContent />
    </section>
  );
}
