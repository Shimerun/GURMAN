import { LayoutGrid, Menu, Phone, Search, ShoppingBasket, ShoppingCart, Tag, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useHasMounted } from '../../hooks/useHasMounted';
import { useCategories } from '../../hooks/useProducts';
import { MOBILE_MENU_ID, NAV_LINKS, STORE_CONTACTS } from '../../lib/constants';
import { PRODUCT_FORMS, formatPrice, pluralize } from '../../lib/format';
import { ROUTES, getCatalogPath, isNavLinkActive } from '../../lib/routes';
import { cn } from '../../lib/utils';
import { selectTotalItems, selectTotalPrice, useCartStore } from '../../store/useCartStore';
import MegaMenu from './MegaMenu';

const MEGA_MENU_ID = 'catalog-mega-menu';

function DesktopNavLinks() {
  const { pathname } = useLocation();

  return (
    <nav aria-label="Основна навігація" className="flex items-center gap-1">
      {NAV_LINKS.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.to === ROUTES.home}
          className={({ isActive }) =>
            cn(
              'whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
              isNavLinkActive(link.to, pathname, isActive)
                ? 'bg-emerald-50 text-emerald-700'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
            )
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}

/** @param {{ isMobileMenuOpen: boolean, onOpenMobileMenu: () => void }} props */
export default function Navbar({ isMobileMenuOpen, onOpenMobileMenu }) {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const megaMenuTriggerRef = useRef(null);
  const megaMenuPanelRef = useRef(null);
  const navigate = useNavigate();
  const { data: categories, isLoading: isCategoriesLoading } = useCategories();

  const openCart = useCartStore((state) => state.openCart);
  const totalItems = useCartStore(selectTotalItems);
  const totalPrice = useCartStore(selectTotalPrice);
  const hasMounted = useHasMounted();
  const badgeCount = hasMounted ? totalItems : 0;
  const subtotal = hasMounted ? totalPrice : 0;

  useEffect(() => {
    if (!isMegaMenuOpen) return undefined;

    const handlePointerDown = (event) => {
      const isInsideMenu =
        megaMenuPanelRef.current?.contains(event.target) || megaMenuTriggerRef.current?.contains(event.target);
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

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    navigate(getCatalogPath({ search: query }));
    setSearchQuery('');
    // Hides the on-screen keyboard so results are visible.
    event.currentTarget.querySelector('input')?.blur();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Відкрити меню"
          aria-expanded={isMobileMenuOpen}
          aria-controls={MOBILE_MENU_ID}
          className="-ml-2 grid h-10 w-10 shrink-0 place-items-center rounded-full text-slate-700 transition-colors hover:bg-slate-100 active:bg-slate-200 lg:hidden"
        >
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>

        <Link to={ROUTES.home} className="flex shrink-0 items-center gap-2 rounded-xl" aria-label="GURMAN — на головну">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-600 text-white shadow-sm">
            <ShoppingBasket className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-slate-900">GURMAN</span>
        </Link>

        <button
          ref={megaMenuTriggerRef}
          type="button"
          onClick={() => setIsMegaMenuOpen((isOpen) => !isOpen)}
          aria-expanded={isMegaMenuOpen}
          aria-controls={MEGA_MENU_ID}
          className={cn(
            'hidden h-10 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors md:flex',
            isMegaMenuOpen ? 'bg-emerald-700 text-white' : 'bg-emerald-600 text-white hover:bg-emerald-700',
          )}
        >
          {isMegaMenuOpen ? <X className="h-4 w-4" aria-hidden="true" /> : <LayoutGrid className="h-4 w-4" aria-hidden="true" />}
          Категорії
        </button>

        <form role="search" onSubmit={handleSearchSubmit} className="order-last w-full md:order-none md:w-auto md:flex-1">
          <label className="relative block">
            <span className="sr-only">Пошук товарів</span>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            {/* text-base on mobile (16px) prevents iOS Safari from zooming into the field on focus. */}
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Пошук: молоко, сир, банани…"
              autoComplete="off"
              enterKeyHint="search"
              className="h-10 w-full rounded-full border border-slate-200 bg-white pl-10 pr-10 text-base text-slate-800 transition-colors placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 md:text-sm [&::-webkit-search-cancel-button]:hidden"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Очистити пошук"
                className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </label>
        </form>

        <a
          href={STORE_CONTACTS.phoneHref}
          className="hidden shrink-0 items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 xl:flex"
        >
          <Phone className="h-4 w-4 text-emerald-600" aria-hidden="true" />
          {STORE_CONTACTS.phone}
        </a>

        <button
          type="button"
          onClick={openCart}
          aria-label={`Кошик: ${pluralize(badgeCount, PRODUCT_FORMS)} на суму ${formatPrice(subtotal)}`}
          className="ml-auto flex h-10 shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-3 transition-colors hover:border-emerald-500 active:bg-slate-50 md:ml-0"
        >
          <span className="relative">
            <ShoppingCart className="h-5 w-5 text-slate-700" aria-hidden="true" />
            {/* Keyed by count so the pop animation replays on every change. */}
            <span
              key={badgeCount}
              aria-hidden="true"
              className={cn(
                'absolute -right-2.5 -top-2.5 grid h-5 min-w-5 animate-badge-pop place-items-center rounded-full px-1 text-[11px] font-bold leading-none',
                badgeCount > 0 ? 'bg-amber-400 text-slate-900' : 'bg-slate-200 text-slate-500',
              )}
            >
              {badgeCount}
            </span>
          </span>
          <span className="hidden text-sm font-semibold tabular-nums text-slate-800 sm:inline">{formatPrice(subtotal)}</span>
        </button>
      </div>

      <div className="hidden border-t border-slate-100 lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-8 py-1.5">
          <DesktopNavLinks />
          <Link
            to={getCatalogPath({ onlyPromo: true, sort: 'discount' })}
            className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 text-sm font-semibold text-amber-900 transition-colors hover:bg-amber-200"
          >
            <Tag className="h-4 w-4" aria-hidden="true" />
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
