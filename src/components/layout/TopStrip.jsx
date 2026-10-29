import { MapPin, Truck } from 'lucide-react';
import { CITIES, FREE_DELIVERY_THRESHOLD } from '../../lib/constants';
import { useCartStore } from '../../store/useCartStore';

export default function TopStrip() {
  const city = useCartStore((state) => state.city);
  const setCity = useCartStore((state) => state.setCity);

  return (
    <div className="bg-emerald-800 text-emerald-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2 text-xs sm:px-6 sm:text-sm lg:px-8">
        <p className="flex min-w-0 items-center gap-2">
          <Truck className="h-4 w-4 shrink-0 text-amber-300" aria-hidden="true" />
          <span className="truncate">Безкоштовна доставка від ₴ {FREE_DELIVERY_THRESHOLD}</span>
        </p>
        <label className="flex shrink-0 items-center gap-1.5">
          <MapPin className="h-4 w-4 text-amber-300" aria-hidden="true" />
          <span className="sr-only">Ваше місто</span>
          <select
            value={city}
            onChange={(event) => setCity(event.target.value)}
            className="cursor-pointer rounded-full border-0 bg-emerald-900/60 py-1 pl-2.5 pr-2 font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          >
            {CITIES.map((cityName) => (
              <option key={cityName} value={cityName} className="text-slate-800">
                {cityName}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
