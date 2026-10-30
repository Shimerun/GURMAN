import { Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CITY, STORE_CONTACTS } from '../../lib/constants';
import { ROUTES } from '../../lib/routes';

/** Answers the two questions every first-time visitor has: where, and when the stores are open. */
export default function TopStrip() {
  return (
    <div className="bg-emerald-800 text-emerald-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-1.5 text-xs sm:px-6 sm:text-sm lg:px-8">
        <p className="flex min-w-0 items-center gap-2">
          <Clock className="h-4 w-4 shrink-0 text-amber-300" aria-hidden="true" />
          <span className="truncate">
            <span className="sm:hidden">{STORE_CONTACTS.storeHours}</span>
            <span className="hidden sm:inline">Магазини працюють {STORE_CONTACTS.storeHours.toLowerCase()} — обирайте на сайті, купуйте поруч.</span>{' '}
            <Link to={ROUTES.delivery} className="hidden font-semibold text-white underline underline-offset-2 hover:text-amber-200 md:inline">
              Як купити
            </Link>
          </span>
        </p>
        <Link
          to={ROUTES.contacts}
          className="flex min-h-8 shrink-0 items-center gap-1.5 rounded-full bg-emerald-900/60 py-1 pl-2 pr-3 font-semibold text-white transition-colors hover:bg-emerald-900"
        >
          <MapPin className="h-4 w-4 text-amber-300" aria-hidden="true" />
          <span className="sr-only">Магазини, місто: </span>
          {CITY}
          <span className="hidden font-normal text-emerald-100 sm:inline">· 2 магазини</span>
        </Link>
      </div>
    </div>
  );
}
