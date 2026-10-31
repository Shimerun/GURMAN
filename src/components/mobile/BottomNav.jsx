import { House, LayoutGrid, MapPin, ShoppingBasket, Tag } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useHasMounted } from '../../hooks/useHasMounted';
import { PROMO_LISTING_QUERY } from '../../lib/constants';
import { PRODUCT_FORMS, pluralize } from '../../lib/format';
import { ROUTES, getCatalogPath, isNavLinkActive, isPromoListing } from '../../lib/routes';
import { cn } from '../../lib/utils';
import { selectTotalItems, useCartStore } from '../../store/useCartStore';

/** `isActive` decides from the full location, because "Акції" and "Каталог" share the /catalog path. */
const TABS = [
  { id: 'home', to: ROUTES.home, label: 'Головна', icon: House, isActive: (pathname) => pathname === ROUTES.home },
  {
    id: 'catalog',
    to: ROUTES.catalog,
    label: 'Каталог',
    icon: LayoutGrid,
    isActive: (pathname, search) => isNavLinkActive(ROUTES.catalog, pathname, false) && !isPromoListing(pathname, search),
  },
  {
    id: 'promo',
    to: getCatalogPath(PROMO_LISTING_QUERY),
    label: 'Акції',
    icon: Tag,
    isActive: (pathname, search) => isPromoListing(pathname, search),
  },
  { id: 'cart', to: ROUTES.cart, label: 'Кошик', icon: ShoppingBasket, isActive: (pathname) => pathname === ROUTES.cart },
  { id: 'stores', to: ROUTES.contacts, label: 'Магазини', icon: MapPin, isActive: (pathname) => pathname === ROUTES.contacts },
];

/** Positions of the sliding highlight, one per tab (it is one tab wide). */
const HIGHLIGHT_POSITIONS = ['translate-x-0', 'translate-x-full', 'translate-x-[200%]', 'translate-x-[300%]', 'translate-x-[400%]'];

/** App-style tab bar below the `md` breakpoint; SiteLayout reserves its height at the bottom of the page. */
export default function BottomNav() {
  const { pathname, search, key: locationKey } = useLocation();
  // The active icon pops only after a navigation, not on page load.
  const [initialLocationKey] = useState(locationKey);
  const hasNavigated = locationKey !== initialLocationKey;
  const activeIndex = TABS.findIndex((tab) => tab.isActive(pathname, search));
  const totalItems = useCartStore(selectTotalItems);
  const hasMounted = useHasMounted();
  const cartCount = hasMounted ? totalItems : 0;

  return (
    <nav aria-label="Швидка навігація" className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-md md:hidden">
      {/* One highlight slides between tabs; it fades out on pages without a tab (e.g. "Про нас"). */}
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute left-0 top-0 flex h-14 w-1/5 justify-center pt-1 transition-[transform,opacity] duration-300 ease-out motion-reduce:transition-none',
          activeIndex >= 0 ? HIGHLIGHT_POSITIONS[activeIndex] : 'opacity-0',
        )}
      >
        <span className="h-8 w-14 rounded-full bg-emerald-50" />
      </span>
      <ul className="relative grid h-14 grid-cols-5">
        {TABS.map(({ id, to, label, icon: Icon }, index) => {
          const isActive = index === activeIndex;
          return (
            <li key={id}>
              <Link
                to={to}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'flex h-full min-h-11 w-full flex-col items-center justify-center gap-0.5 text-xs font-medium transition-colors active:scale-95 motion-reduce:active:scale-100',
                  isActive ? 'text-emerald-800' : 'text-slate-600 hover:text-slate-900',
                )}
              >
                <span className="relative" data-cart-target={id === 'cart' ? true : undefined}>
                  <Icon
                    key={isActive ? 'active' : 'idle'}
                    className={cn('h-6 w-6', isActive && hasNavigated && 'animate-tab-pop')}
                    strokeWidth={isActive ? 2.25 : 1.75}
                    aria-hidden="true"
                  />
                  {id === 'cart' && cartCount > 0 && (
                    <span
                      key={cartCount}
                      className="absolute -right-2.5 -top-1.5 grid h-[18px] min-w-[18px] animate-badge-pop place-items-center rounded-full bg-amber-400 px-1 text-xs font-bold leading-none text-slate-900"
                    >
                      <span aria-hidden="true">{cartCount}</span>
                      <span className="sr-only">{pluralize(cartCount, PRODUCT_FORMS)}</span>
                    </span>
                  )}
                </span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
