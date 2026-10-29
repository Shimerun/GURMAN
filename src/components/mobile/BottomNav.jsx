import { BadgePercent, Home, LayoutGrid, MapPin, ShoppingBasket } from 'lucide-react';
import { useHasMounted } from '../../hooks/useHasMounted';
import { PRODUCT_FORMS, pluralize } from '../../lib/format';
import { cn } from '../../lib/utils';
import { selectTotalItems, useCartStore } from '../../store/useCartStore';
import { useUIStore } from '../../store/useUIStore';

const TABS = [
  { id: 'home', label: 'Головна', icon: Home },
  { id: 'catalog', label: 'Каталог', icon: LayoutGrid },
  { id: 'promo', label: 'Акції', icon: BadgePercent },
  { id: 'cart', label: 'Кошик', icon: ShoppingBasket },
  { id: 'stores', label: 'Магазини', icon: MapPin },
];

export default function BottomNav() {
  const activeTab = useUIStore((state) => state.activeTab);
  const setTab = useUIStore((state) => state.setTab);
  const totalItems = useCartStore(selectTotalItems);
  const hasMounted = useHasMounted();
  const cartCount = hasMounted ? totalItems : 0;

  return (
    <nav
      aria-label="Основна навігація"
      className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-slate-200/70 bg-white/80 backdrop-blur-md"
    >
      <ul className="grid h-14 grid-cols-5">
        {TABS.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => setTab(id)}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'flex h-full min-h-11 w-full flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors active:scale-95',
                  isActive ? 'text-emerald-600' : 'text-slate-500',
                )}
              >
                <span className="relative">
                  <Icon className="h-6 w-6" strokeWidth={isActive ? 2.25 : 1.75} aria-hidden="true" />
                  {id === 'cart' && cartCount > 0 && (
                    <span
                      key={cartCount}
                      className="absolute -right-2.5 -top-1.5 grid h-[18px] min-w-[18px] animate-badge-pop place-items-center rounded-full bg-amber-400 px-1 text-[10px] font-bold leading-none text-slate-900"
                    >
                      <span aria-hidden="true">{cartCount}</span>
                      <span className="sr-only">{pluralize(cartCount, PRODUCT_FORMS)}</span>
                    </span>
                  )}
                </span>
                {label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
