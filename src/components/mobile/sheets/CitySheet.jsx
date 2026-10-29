import { Check } from 'lucide-react';
import { CITIES } from '../../../lib/constants';
import { cn } from '../../../lib/utils';
import { useCartStore } from '../../../store/useCartStore';
import { useUIStore } from '../../../store/useUIStore';
import BottomSheet from '../BottomSheet';

export default function CitySheet() {
  const city = useCartStore((state) => state.city);
  const setCity = useCartStore((state) => state.setCity);
  const closeSheet = useUIStore((state) => state.closeSheet);

  const handleSelect = (cityName) => {
    setCity(cityName);
    closeSheet();
  };

  return (
    <BottomSheet title="Оберіть місто" onClose={closeSheet}>
      <ul className="space-y-1">
        {CITIES.map((cityName) => {
          const isSelected = cityName === city;
          return (
            <li key={cityName}>
              <button
                type="button"
                onClick={() => handleSelect(cityName)}
                aria-pressed={isSelected}
                className={cn(
                  'flex min-h-12 w-full items-center justify-between rounded-2xl px-4 text-base active:scale-[0.98]',
                  isSelected ? 'bg-emerald-50 font-semibold text-emerald-800' : 'text-slate-800 active:bg-slate-100',
                )}
              >
                {cityName}
                {isSelected && <Check className="h-5 w-5 text-emerald-600" aria-hidden="true" />}
              </button>
            </li>
          );
        })}
      </ul>
    </BottomSheet>
  );
}
