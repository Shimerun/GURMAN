import { Clock, MapPin, Navigation, Phone } from 'lucide-react';
import { ANALYTICS_EVENTS, trackEvent } from '../../lib/analytics';
import { CITY } from '../../lib/constants';
import { buttonClassName } from '../../lib/buttonStyles';
import { getDirectionsUrl } from '../../lib/routes';
import { formatStoreHours, isStoreOpen } from '../../lib/storeHours';
import { cn } from '../../lib/utils';

/** @param {{ store: import('../../services/storeService').Store }} props */
export default function StoreCard({ store }) {
  const isOpen = isStoreOpen(store.hours);
  const fullAddress = `${CITY}, ${store.address}`;

  return (
    <article className="flex h-full flex-col rounded-lg bg-white p-5 shadow-soft ring-1 ring-slate-100">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-bold text-slate-900">{store.name}</h3>
        <span
          className={cn(
            'inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold leading-none',
            isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800',
          )}
        >
          <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
            {isOpen && <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 motion-safe:animate-ping-slow" />}
            <span className={cn('relative inline-flex h-1.5 w-1.5 rounded-full', isOpen ? 'bg-emerald-600' : 'bg-red-600')} />
          </span>
          {isOpen ? 'Відкрито зараз' : 'Зараз зачинено'}
        </span>
      </div>
      <ul className="mt-3 flex-1 space-y-2 text-sm text-slate-700">
        <li className="flex items-start gap-2">
          <MapPin className="pin-drop mt-0.5 h-4 w-4 shrink-0 text-emerald-700" aria-hidden="true" />
          {fullAddress}
        </li>
        <li className="flex items-center gap-2">
          <Clock className="h-4 w-4 shrink-0 text-emerald-700" aria-hidden="true" />
          <span>
            <span className="sr-only">Години роботи: </span>
            {formatStoreHours(store.hours)}
          </span>
        </li>
        <li className="flex items-center gap-2">
          <Phone className="h-4 w-4 shrink-0 text-emerald-700" aria-hidden="true" />
          <span className="tabular-nums">{store.phone}</span>
        </li>
      </ul>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <a
          href={getDirectionsUrl(fullAddress)}
          onClick={() => trackEvent(ANALYTICS_EVENTS.directions, { store: store.name })}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClassName({ size: 'sm', className: 'w-full' })}
        >
          <Navigation className="h-4 w-4" aria-hidden="true" />
          Маршрут
          <span className="sr-only">до {store.name} (відкриється в новій вкладці)</span>
        </a>
        <a
          href={`tel:${store.phone.replace(/\s/g, '')}`}
          onClick={() => trackEvent(ANALYTICS_EVENTS.call, { store: store.name })}
          className={buttonClassName({ variant: 'secondary', size: 'sm', className: 'w-full' })}
        >
          <Phone className="h-4 w-4" aria-hidden="true" />
          Дзвінок
          <span className="sr-only">у {store.name}</span>
        </a>
      </div>
    </article>
  );
}
