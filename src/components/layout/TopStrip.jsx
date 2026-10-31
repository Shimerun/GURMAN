import { Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCurrentTime } from '../../hooks/useCurrentTime';
import { useStores } from '../../hooks/useStores';
import { CITY, STORE_CONTACTS } from '../../lib/constants';
import { ROUTES } from '../../lib/routes';
import { getStoresOpenStatus } from '../../lib/storeHours';
import { cn } from '../../lib/utils';
import BrandIcon from '../ui/BrandIcon';

/**
 * "Open now · until 22:00" / "Closed · opens at 07:00"; the static hours until the stores load.
 * @param {{ stores: import('../../services/storeService').Store[] }} props
 */
function StoresOpenStatus({ stores }) {
  const now = useCurrentTime();

  if (stores.length === 0) {
    return (
      <span className="flex shrink-0 items-center gap-2">
        <Clock className="h-4 w-4 shrink-0 text-amber-300" aria-hidden="true" />
        {STORE_CONTACTS.storeHours}
      </span>
    );
  }

  const { isOpen, time } = getStoresOpenStatus(stores, now);
  const timeLabel = time && (isOpen ? ` · до ${time}` : ` · відкриємося о ${time}`);

  return (
    <span className="flex shrink-0 items-center gap-2 font-semibold text-white">
      <span className="relative flex h-2 w-2" aria-hidden="true">
        {isOpen && <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75 motion-safe:animate-ping-slow" />}
        <span className={cn('relative inline-flex h-2 w-2 rounded-full', isOpen ? 'bg-emerald-300' : 'bg-red-400')} />
      </span>
      {isOpen ? 'Відкрито зараз' : 'Зачинено'}
      {timeLabel}
    </span>
  );
}

/** Answers the two questions every first-time visitor has: where, and whether the stores are open right now. */
export default function TopStrip() {
  const { data: stores } = useStores();

  return (
    <div className="bg-emerald-800 text-emerald-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-1.5 text-xs sm:px-6 sm:text-sm lg:px-8">
        <p className="flex min-w-0 items-center gap-2">
          <StoresOpenStatus stores={stores} />
          <span className="hidden truncate sm:inline">
            {stores.length > 0 && <>{STORE_CONTACTS.storeHours} · </>}
            Обирайте на сайті, купуйте поруч.{' '}
            <Link to={ROUTES.delivery} className="hidden font-semibold text-white underline underline-offset-2 hover:text-amber-200 md:inline">
              Як купити
            </Link>
          </span>
        </p>
        <Link
          to={ROUTES.contacts}
          className="flex min-h-8 shrink-0 items-center gap-1.5 rounded-lg bg-emerald-900/60 py-1 pl-2 pr-3 font-semibold text-white transition-colors hover:bg-emerald-900"
        >
          <BrandIcon name="pin" className="h-4 w-4 text-gray-50" />
          <span className="sr-only">Магазини, місто: </span>
          {CITY}
          <span className="hidden font-normal text-emerald-100 sm:inline">· 2 магазини</span>
        </Link>
      </div>
    </div>
  );
}
