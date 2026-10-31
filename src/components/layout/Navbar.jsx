import { Heart, Menu, Phone, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAnimatedNumber } from '../../hooks/useAnimatedNumber';
import { useHasMounted } from '../../hooks/useHasMounted';
import { useIsScrollingDown } from '../../hooks/useIsScrollingDown';
import { useCategories } from '../../hooks/useProducts';
import { MOBILE_MENU_ID, NAV_LINKS, PROMO_LISTING_QUERY, STORE_CONTACTS } from '../../lib/constants';
import { PRODUCT_FORMS, formatPrice, pluralize } from '../../lib/format';
import { ROUTES, getCatalogPath, isNavLinkActive, isPromoListing } from '../../lib/routes';
import { cn } from '../../lib/utils';
import { selectTotalItems, selectTotalPrice, useCartStore } from '../../store/useCartStore';
import { selectFavoriteCount, useFavoritesStore } from '../../store/useFavoritesStore';
import BrandIcon from '../ui/BrandIcon';
import BrandLogo from '../ui/BrandLogo';
import MegaMenu from './MegaMenu';
import SearchBox from './SearchBox';

const MEGA_MENU_ID = 'catalog-mega-menu';
const PROMO_PATH = getCatalogPath(PROMO_LISTING_QUERY);

function DesktopNavLinks() {
  const { pathname, search } = useLocation();
  const isOnPromo = isPromoListing(pathname, search);

  return (
    <nav aria-label="Основна навігація" className="flex items-center gap-1">
      {NAV_LINKS.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.to === ROUTES.home}
          className={({ isActive }) =>
            cn(
              'inline-flex min-h-10 items-center whitespace-nowrap rounded-lg px-3.5 text-sm font-medium transition-colors',
              isNavLinkActive(link.to, pathname, isActive) && !(link.to === ROUTES.catalog && isOnPromo)
                ? 'bg-emerald-50 text-emerald-800'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900',
            )
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}

/**
 * @param {{ isMobileMenuOpen: boolean, onOpenMobileMenu: () => void, isLogoIntroAnimated?: boolean, isLogoHidden?: boolean }} props
 * `isLogoHidden` keeps the logo invisible while the opening splash flies its copy into place.
 */
export default function Navbar({ isMobileMenuOpen, onOpenMobileMenu, isLogoIntroAnimated = true, isLogoHidden = false }) {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const megaMenuTriggerRef = useRef(null);
  const megaMenuPanelRef = useRef(null);
  const { pathname, search } = useLocation();
  const { data: categories, isLoading: isCategoriesLoading } = useCategories();

  const openCart = useCartStore((state) => state.openCart);
  const totalItems = useCartStore(selectTotalItems);
  const totalPrice = useCartStore(selectTotalPrice);
  const hasMounted = useHasMounted();
  const badgeCount = hasMounted ? totalItems : 0;
  const favoriteCount = useFavoritesStore(selectFavoriteCount);
  const favoriteBadgeCount = hasMounted ? favoriteCount : 0;
  const subtotal = hasMounted ? totalPrice : 0;
  // Animated from the persisted total (not from the pre-mount 0), so page loads don't count up.
  const animatedTotalPrice = useAnimatedNumber(totalPrice);
  const isOnPromo = isPromoListing(pathname, search);
  const isCompact = useIsScrollingDown();

  useEffect(() => {
    if (!isMegaMenuOpen) return undefined;

    const handlePointerDown = (event) => {
      const isInsideMenu = megaMenuPanelRef.current?.contains(event.target) || megaMenuTriggerRef.current?.contains(event.target);
      if (!isInsideMenu) setIsMegaMenuOpen(false);
    };
    const handleKeyDown = (event) => {
      if (event.key !== 'Escape') return;
      setIsMegaMenuOpen(false);
      megaMenuTriggerRef.current?.focus();
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMegaMenuOpen]);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-md transition-transform duration-200 ease-out motion-reduce:transition-none',
        // Phones: scrolling down slides the logo row away and keeps search pinned (3.25rem = row +
        // gap, leaving search the same top inset as bottom). Keyboard focus inside brings it back.
        isCompact && 'max-md:[&:not(:focus-within)]:-translate-y-[3.25rem]',
      )}
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-3 gap-y-2 px-4 py-2.5 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Відкрити меню"
          aria-expanded={isMobileMenuOpen}
          aria-controls={MOBILE_MENU_ID}
          className="-ml-2 grid h-11 w-11 shrink-0 place-items-center rounded-full text-slate-700 transition-colors hover:bg-slate-100 active:bg-slate-200 lg:hidden"
        >
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>

        <BrandLogo showTagline isIntroAnimated={isLogoIntroAnimated} className={isLogoHidden ? 'invisible' : undefined} />

        <button
          ref={megaMenuTriggerRef}
          type="button"
          onClick={() => setIsMegaMenuOpen((isOpen) => !isOpen)}
          aria-expanded={isMegaMenuOpen}
          aria-controls={MEGA_MENU_ID}
          className={cn(
            'ml-2 hidden h-11 shrink-0 items-center gap-2 rounded-lg px-4 text-sm font-semibold text-white transition-colors md:flex',
            isMegaMenuOpen ? 'bg-emerald-900' : 'bg-emerald-700 hover:bg-emerald-800',
          )}
        >
          {isMegaMenuOpen ? <X className="h-4 w-4" aria-hidden="true" /> : <BrandIcon name="catalog" className="h-4 w-4" />}
          Категорії
        </button>

        <SearchBox className="order-last w-full md:order-none md:w-auto md:flex-1" />

        <a
          href={STORE_CONTACTS.phoneHref}
          className="hidden h-11 shrink-0 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 xl:flex"
        >
          <Phone className="h-4 w-4 text-emerald-700" aria-hidden="true" />
          {STORE_CONTACTS.phone}
        </a>

        <Link
          to={ROUTES.favorites}
          aria-label={favoriteBadgeCount > 0 ? `Обране: ${pluralize(favoriteBadgeCount, PRODUCT_FORMS)}` : 'Обране'}
          aria-current={pathname === ROUTES.favorites ? 'page' : undefined}
          className="relative ml-auto grid h-11 w-11 shrink-0 place-items-center rounded-full text-slate-800 transition-colors hover:bg-slate-100 active:bg-slate-200 md:ml-0"
        >
          <Heart className={cn('h-5 w-5', favoriteBadgeCount > 0 && 'fill-red-500 text-red-500')} aria-hidden="true" />
          {favoriteBadgeCount > 0 && (
            <span
              key={favoriteBadgeCount}
              aria-hidden="true"
              className="absolute right-0 top-0 grid h-5 min-w-5 animate-badge-pop place-items-center rounded-full bg-slate-800 px-1 text-xs font-bold leading-none text-white"
            >
              {favoriteBadgeCount}
            </span>
          )}
        </Link>

        <button
          type="button"
          onClick={openCart}
          data-cart-target
          aria-label={`Кошик: ${pluralize(badgeCount, PRODUCT_FORMS)} на суму ${formatPrice(subtotal)}`}
          className="flex h-11 shrink-0 items-center gap-2.5 rounded-lg border border-slate-200 bg-white pl-3.5 pr-3.5 transition-colors hover:border-emerald-600 active:bg-slate-50 sm:pr-4"
        >
          <span className="relative">
            <BrandIcon name="basket" className="h-5 w-5 text-slate-800" />
            {/* Keyed by count so the pop animation replays on every change. */}
            <span
              key={badgeCount}
              aria-hidden="true"
              className={cn(
                'absolute -right-2.5 -top-2.5 grid h-5 min-w-5 animate-badge-pop place-items-center rounded-full px-1 text-xs font-bold leading-none',
                badgeCount > 0 ? 'bg-amber-400 text-slate-900' : 'bg-slate-200 text-slate-600',
              )}
            >
              {badgeCount}
            </span>
          </span>
          <span className="hidden text-sm font-semibold tabular-nums text-slate-900 sm:inline">{formatPrice(hasMounted ? animatedTotalPrice : 0)}</span>
        </button>
      </div>

      <div className="hidden border-t border-slate-100 lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-8 py-1">
          <DesktopNavLinks />
          <Link
            to={PROMO_PATH}
            aria-current={isOnPromo ? 'page' : undefined}
            className={cn(
              'inline-flex min-h-10 items-center gap-1.5 rounded-lg px-4 text-sm font-semibold transition-colors',
              isOnPromo ? 'bg-amber-400 text-slate-900' : 'bg-amber-100 text-amber-900 hover:bg-amber-200',
            )}
          >
            <BrandIcon name="tag" className="h-4 w-4" />
            Акції тижня
          </Link>
        </div>
      </div>

      {isMegaMenuOpen && (
        <MegaMenu
          ref={megaMenuPanelRef}
          id={MEGA_MENU_ID}
          categories={categories}
          isLoading={isCategoriesLoading}
          onNavigate={() => setIsMegaMenuOpen(false)}
        />
      )}
    </header>
  );
}
