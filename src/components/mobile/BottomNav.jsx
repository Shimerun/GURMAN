import { House, LayoutGrid, MapPin, ShoppingBasket } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useHasMounted } from '../../hooks/useHasMounted';
import { PRODUCT_FORMS, pluralize } from '../../lib/format';
import { ROUTES, isNavLinkActive } from '../../lib/routes';
import { cn } from '../../lib/utils';
import { selectTotalItems, useCartStore } from '../../store/useCartStore';

const TABS = [
  { to: ROUTES.home, label: 'Головна', icon: House },
  { to: ROUTES.catalog, label: 'Каталог', icon: LayoutGrid },
  { to: ROUTES.cart, label: 'Кошик', icon: ShoppingBasket },
  { to: ROUTES.contacts, label: 'Контакти', icon: MapPin },
];

/** App-style tab bar below the `md` breakpoint; SiteLayout reserves its height at the bottom of the page. */
export default function BottomNav() {
  const { pathname } = useLocation();
  const totalItems = useCartStore(selectTotalItems);
  const hasMounted = useHasMounted();
  const cartCount = hasMounted ? totalItems : 0;

  return (
    <nav
      aria-label="Швидка навігація"
      className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-slate-200/70 bg-white/90 backdrop-blur-md md:hidden"
    >
      <ul className="grid h-14 grid-cols-4">
        {TABS.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === ROUTES.home}
              className={({ isActive }) =>
                cn(
                  'flex h-full min-h-11 w-full flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors active:scale-95',
                  isNavLinkActive(to, pathname, isActive) ? 'text-emerald-600' : 'text-slate-500',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span className="relative">
                    <Icon className="h-6 w-6" strokeWidth={isNavLinkActive(to, pathname, isActive) ? 2.25 : 1.75} aria-hidden="true" />
                    {to === ROUTES.cart && cartCount > 0 && (
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
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
