import { Store as StoreIcon } from 'lucide-react';
import { useStores } from '../../hooks/useStores';
import { IN_CITY, SECTION_IDS, STORE_CONTACTS } from '../../lib/constants';
import { STORE_FORMS, pluralize } from '../../lib/format';
import EmptyState from '../ui/EmptyState';
import ErrorState from '../ui/ErrorState';
import SectionHeader from '../ui/SectionHeader';
import StoreCard from '../ui/StoreCard';

const STORE_GRID_CLASS_NAME = 'grid gap-3 sm:grid-cols-2 sm:gap-4';

function StoresContent() {
  const { data: stores, isLoading, error, refetch } = useStores();

  if (isLoading) {
    return (
      <ul className={STORE_GRID_CLASS_NAME} aria-busy="true" aria-label="Завантаження магазинів">
        {Array.from({ length: 2 }, (_, index) => (
          <li key={index} className="skeleton h-56 rounded-lg" />
        ))}
      </ul>
    );
  }

  if (error && stores.length === 0) return <ErrorState title="Не вдалося завантажити магазини" onRetry={refetch} />;

  if (stores.length === 0) {
    return (
      <EmptyState
        icon={StoreIcon}
        title="Список магазинів оновлюється"
        description={`Зателефонуйте на гарячу лінію ${STORE_CONTACTS.phone} — підкажемо найближчий магазин.`}
      />
    );
  }

  return (
    <ul className={STORE_GRID_CLASS_NAME} aria-label={pluralize(stores.length, STORE_FORMS)}>
      {stores.map((store) => (
        <li key={store.id} className="scroll-reveal">
          <StoreCard store={store} />
        </li>
      ))}
    </ul>
  );
}

export default function StoresBlock() {
  return (
    <section id={SECTION_IDS.stores} aria-labelledby="stores-heading">
      <SectionHeader id="stores-heading" title={`Магазини GURMAN ${IN_CITY}`} />
      <StoresContent />
    </section>
  );
}
