import { ChevronDown, MapPin, Search, ShoppingBasket, X } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useUIStore } from '../../store/useUIStore';

/**
 * Fixed height 7.25rem (+ safe-area): .top-below-mobile-header in index.css depends on it.
 * @param {{ searchQuery: string, onSearchChange: (query: string) => void }} props
 */
export default function MobileHeader({ searchQuery, onSearchChange }) {
  const city = useCartStore((state) => state.city);
  const openSheet = useUIStore((state) => state.openSheet);
  const setTab = useUIStore((state) => state.setTab);

  const handleSearchChange = (event) => {
    const { value } = event.target;
    onSearchChange(value);
    if (value.trim()) setTab('catalog');
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    // Hides the on-screen keyboard so results are visible.
    event.currentTarget.querySelector('input')?.blur();
  };

  return (
    <header className="pt-safe sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
      <div className="px-4 pb-3 pt-2">
        <div className="flex h-11 items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setTab('home')}
            aria-label="GURMAN — на головну"
            className="flex min-h-11 items-center gap-2 active:scale-95"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-600 text-white shadow-sm">
              <ShoppingBasket className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="text-lg font-extrabold tracking-tight text-slate-900">GURMAN</span>
          </button>

          <button
            type="button"
            onClick={() => openSheet('city')}
            aria-label={`Місто: ${city}. Змінити`}
            className="flex min-h-11 items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 text-sm font-semibold text-emerald-800 ring-1 ring-emerald-100 active:scale-95"
          >
            <MapPin className="h-4 w-4" aria-hidden="true" />
            {city}
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <form role="search" onSubmit={handleSearchSubmit} className="mt-2">
          <label className="relative block">
            <span className="sr-only">Пошук товарів</span>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            {/* text-base (16px) prevents iOS Safari from zooming into the field on focus. */}
            <input
              type="search"
              inputMode="search"
              enterKeyHint="search"
              autoComplete="off"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Пошук продуктів"
              className="h-11 w-full rounded-full border border-slate-200 bg-white pl-11 pr-12 text-base text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 [&::-webkit-search-cancel-button]:hidden"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                aria-label="Очистити пошук"
                className="absolute right-0 top-1/2 grid min-h-11 min-w-11 -translate-y-1/2 place-items-center rounded-full text-slate-400 active:scale-95"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            )}
          </label>
        </form>
      </div>
    </header>
  );
}
