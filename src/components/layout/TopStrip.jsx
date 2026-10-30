import { Clock, MapPin } from 'lucide-react';
import { CITY, STORE_CONTACTS } from '../../lib/constants';

export default function TopStrip() {
  return (
    <div className="bg-emerald-800 text-emerald-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2 text-xs sm:px-6 sm:text-sm lg:px-8">
        <p className="flex min-w-0 items-center gap-2">
          <Clock className="h-4 w-4 shrink-0 text-amber-300" aria-hidden="true" />
          <span className="truncate">{STORE_CONTACTS.storeHours}</span>
        </p>
        {/* Single-city chain: the city is shown, not chosen. */}
        <p className="flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-900/60 py-1 pl-2 pr-3 font-medium text-white">
          <MapPin className="h-4 w-4 text-amber-300" aria-hidden="true" />
          <span className="sr-only">Місто: </span>
          {CITY}
        </p>
      </div>
    </div>
  );
}
