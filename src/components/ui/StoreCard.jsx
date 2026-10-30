import { Clock, MapPin, Phone } from 'lucide-react';
import { CITY } from '../../lib/constants';
import { formatStoreHours, isStoreOpen } from '../../lib/storeHours';
import { cn } from '../../lib/utils';

/** @param {{ store: import('../../services/storeService').Store, children?: import('react').ReactNode }} props `children` renders an actions row. */
export default function StoreCard({ store, children }) {
  const isOpen = isStoreOpen(store.hours);

  return (
    <article className="flex h-full flex-col rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-slate-900">{store.name}</h3>
        <span
          className={cn(
            'badge badge-sm h-auto shrink-0 border-0 py-0.5 font-medium',
            isOpen ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700',
          )}
        >
          {isOpen ? 'Відкрито' : 'Закрито'}
        </span>
      </div>
      <ul className="mt-3 space-y-2 text-sm text-slate-600">
        <li className="flex items-start gap-2">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
          <span>
            {CITY}, {store.address}
          </span>
        </li>
        <li className="flex items-center gap-2">
          <Clock className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
          <span>
            <span className="sr-only">Години роботи: </span>
            {formatStoreHours(store.hours)}
          </span>
        </li>
        <li className="flex items-center gap-2">
          <Phone className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
          <a href={`tel:${store.phone.replace(/\s/g, '')}`} className="hover:text-emerald-700 hover:underline">
            {store.phone}
          </a>
        </li>
      </ul>
      {children}
    </article>
  );
}
