import { LayoutGrid, Search, ShoppingBasket, ShoppingCart, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useHasMounted } from '../../hooks/useHasMounted';
import { NAV_LINKS, SECTION_IDS } from '../../lib/constants';
import { PRODUCT_FORMS, formatPrice, pluralize } from '../../lib/format';
import { cn, scrollToSection } from '../../lib/utils';
import { selectTotalItems, selectTotalPrice, useCartStore } from '../../store/useCartStore';
import MegaMenu from './MegaMenu';

const MEGA_MENU_ID = 'catalog-mega-menu';

function NavLinks({ className }) {
  return (
    <nav aria-label="Основна навігація" className={className}>
      {NAV_LINKS.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="shrink-0 whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}

/**
 * @param {{
 *   categories: import('../../services/productService').Category[],
 *   isCategoriesLoading: boolean,
 *   searchQuery: string,
 *   onSearchChange: (query: string) => void,
 *   onSelectCategory: (categoryId: string | null) => void,
 *   onShowPromos: () => void,
 * }} props
 */
export default function Navbar({ categories, isCategoriesLoading, searchQuery, onSearchChange, onSelectCategory, onShowPromos }) {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const megaMenuTriggerRef = useRef(null);
  const megaMenuPanelRef = useRef(null);

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

  const handleMegaMenuSelect = (categoryId) => {
    setIsMegaMenuOpen(false);
    onSelectCategory(categoryId);
  };

  const handleMegaMenuPromos = () => {
    setIsMegaMenuOpen(false);
    onShowPromos();
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    scrollToSection(SECTION_IDS.catalog);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3 sm:px-6 lg:px-8">
        <a href="#top" className="flex shrink-0 items-center gap-2" aria-label="GURMAN — на головну">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-600 text-white shadow-sm">
            <ShoppingBasket className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-slate-900">GURMAN</span>
        </a>

        <button
          ref={megaMenuTriggerRef}
          type="button"
          onClick={() => setIsMegaMenuOpen((isOpen) => !isOpen)}
          aria-expanded={isMegaMenuOpen}
          aria-controls={MEGA_MENU_ID}
          aria-label="Каталог"
          className={cn(
            'flex h-10 shrink-0 items-center gap-2 rounded-full px-3 text-sm font-semibold transition-colors sm:px-4',
            isMegaMenuOpen ? 'bg-emerald-700 text-white' : 'bg-emerald-600 text-white hover:bg-emerald-700',
          )}
        >
          {isMegaMenuOpen ? <X className="h-4 w-4" aria-hidden="true" /> : <LayoutGrid className="h-4 w-4" aria-hidden="true" />}
          <span className="hidden sm:inline">Каталог</span>
        </button>

        <form role="search" onSubmit={handleSearchSubmit} className="order-last w-full md:order-none md:w-auto md:flex-1">
          <label className="relative block">
            <span className="sr-only">Пошук товарів</span>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Пошук: молоко, сир, банани…"
              autoComplete="off"
              enterKeyHint="search"
              className="h-10 w-full rounded-full border border-slate-200 bg-white pl-10 pr-10 text-sm text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 [&::-webkit-search-cancel-button]:hidden"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                aria-label="Очистити пошук"
                className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </label>
        </form>

        <NavLinks className="hidden items-center lg:flex" />

        <button
          type="button"
          onClick={openCart}
          aria-label={`Кошик: ${pluralize(badgeCount, PRODUCT_FORMS)} на суму ${formatPrice(subtotal)}`}
          className="ml-auto flex h-10 shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-3 transition-colors hover:border-emerald-500 md:ml-0"
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

        <NavLinks className="scrollbar-hide -mx-1 order-last flex w-full items-center overflow-x-auto lg:hidden" />
      </div>

      {isMegaMenuOpen && (
        <MegaMenu
          ref={megaMenuPanelRef}
          id={MEGA_MENU_ID}
          categories={categories}
          isLoading={isCategoriesLoading}
          onSelectCategory={handleMegaMenuSelect}
          onShowPromos={handleMegaMenuPromos}
        />
      )}
    </header>
  );
}
