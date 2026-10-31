import { Clock, Phone, Store, X } from 'lucide-react';
import { useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useCategories } from '../../hooks/useProducts';
import { MOBILE_MENU_ID, NAV_LINKS, PROMO_LISTING_QUERY, STORE_CONTACTS } from '../../lib/constants';
import { ROUTES, getCatalogPath, getCategoryPath, isNavLinkActive } from '../../lib/routes';
import { cn } from '../../lib/utils';
import BrandIcon from '../ui/BrandIcon';
import BrandLogo from '../ui/BrandLogo';
import CategoryIcon from '../ui/CategoryIcon';

/**
 * Off-canvas navigation below the `lg` breakpoint. Links don't close it themselves:
 * SiteLayout closes it on every route change.
 * @param {{ isOpen: boolean, onClose: () => void }} props
 */
export default function MobileMenu({ isOpen, onClose }) {
  const panelRef = useRef(null);
  const { pathname } = useLocation();
  const { data: categories, isLoading: isCategoriesLoading } = useCategories();

  useFocusTrap(panelRef, { isActive: isOpen, onEscape: onClose });
  useBodyScrollLock(isOpen);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 animate-fade-in bg-slate-900/50" onClick={onClose} aria-hidden="true" />

      <div
        ref={panelRef}
        id={MOBILE_MENU_ID}
        role="dialog"
        aria-modal="true"
        aria-label="Меню сайту"
        tabIndex={-1}
        className="pt-safe pb-safe relative flex h-full w-[min(22rem,88vw)] animate-slide-in-left flex-col overflow-y-auto overscroll-contain bg-white shadow-2xl focus:outline-none"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/95 px-4 py-2.5 backdrop-blur-md">
          <BrandLogo showTagline />
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрити меню"
            className="grid h-11 w-11 place-items-center rounded-full text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <nav aria-label="Основна навігація" className="px-3 py-4">
          <ul className="space-y-1">
            <li>
              <Link
                to={getCatalogPath(PROMO_LISTING_QUERY)}
                className="mb-2 flex min-h-12 items-center gap-2 rounded-lg bg-amber-100 px-3 text-base font-semibold text-amber-900 transition-colors hover:bg-amber-200"
              >
                <BrandIcon name="tag" className="h-5 w-5" />
                Акції тижня
              </Link>
            </li>
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === ROUTES.home}
                  className={({ isActive }) =>
                    cn(
                      'flex min-h-11 items-center rounded-lg px-3 text-base font-medium transition-colors',
                      isNavLinkActive(link.to, pathname, isActive) ? 'bg-emerald-50 text-emerald-800' : 'text-slate-700 hover:bg-slate-50',
                    )
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="mobile-menu-categories" className="border-t border-slate-100 px-3 py-4">
          <h2 id="mobile-menu-categories" className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-600">
            Категорії
          </h2>
          {isCategoriesLoading ? (
            <div className="mt-2 space-y-2 px-3" aria-busy="true" aria-label="Завантаження категорій">
              {Array.from({ length: 6 }, (_, index) => (
                <div key={index} className="skeleton h-9 rounded-lg" />
              ))}
            </div>
          ) : (
            <ul className="mt-2 space-y-0.5">
              {categories.map((category) => (
                <li key={category.id}>
                  <NavLink
                    to={getCategoryPath(category.id)}
                    className={({ isActive }) =>
                      cn(
                        'flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm transition-colors',
                        isActive ? 'bg-emerald-50 font-semibold text-emerald-800' : 'text-slate-700 hover:bg-slate-50',
                      )
                    }
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-800">
                      <CategoryIcon name={category.icon} className="h-4 w-4" />
                    </span>
                    {category.title}
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </nav>

        <div className="mt-auto space-y-3 border-t border-slate-100 px-6 py-5 text-sm text-slate-700">
          <p className="flex gap-2 rounded-lg bg-emerald-50 p-3 text-emerald-900">
            <Store className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            Магазини: {STORE_CONTACTS.storeHours.toLowerCase()}
          </p>
          <a href={STORE_CONTACTS.phoneHref} className="flex min-h-11 items-center gap-2 font-semibold text-slate-900 hover:text-emerald-800">
            <Phone className="h-4 w-4 text-emerald-700" aria-hidden="true" />
            {STORE_CONTACTS.phone}
          </a>
          <p className="flex items-center gap-2">
            <Clock className="h-4 w-4 shrink-0 text-emerald-700" aria-hidden="true" />
            Підтримка: {STORE_CONTACTS.supportHours}
          </p>
        </div>
      </div>
    </div>
  );
}
