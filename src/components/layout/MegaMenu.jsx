import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { PROMO_LISTING_QUERY } from '../../lib/constants';
import { PRODUCT_FORMS, pluralize } from '../../lib/format';
import { ROUTES, getCatalogPath, getCategoryPath } from '../../lib/routes';
import BrandIcon from '../ui/BrandIcon';
import CategoryIcon from '../ui/CategoryIcon';

/**
 * @typedef {Object} MegaMenuProps
 * @property {string} id
 * @property {import('../../services/productService').Category[]} categories
 * @property {boolean} isLoading
 * @property {() => void} onNavigate Called when any link is chosen, so the menu closes.
 */

const MegaMenu = forwardRef(
  /** @param {MegaMenuProps} props */
  function MegaMenu({ id, categories, isLoading, onNavigate }, ref) {
    return (
      <div
        id={id}
        ref={ref}
        className="absolute inset-x-0 top-full max-h-[calc(100dvh-8rem)] animate-fade-in overflow-y-auto border-b border-slate-200 bg-white shadow-xl"
      >
        <nav aria-label="Категорії каталогу" className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4" aria-busy="true">
              {Array.from({ length: 8 }, (_, index) => (
                <div key={index} className="skeleton h-16 rounded-lg" />
              ))}
            </div>
          ) : (
            <ul className="grid grid-cols-1 gap-2 min-[400px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    to={getCategoryPath(category.id)}
                    onClick={onNavigate}
                    className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-emerald-50"
                  >
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-emerald-100 text-emerald-800">
                      <CategoryIcon name={category.icon} className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-slate-800">{category.title}</span>
                      <span className="block text-xs text-slate-500">{pluralize(category.productCount, PRODUCT_FORMS)}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
            <Link
              to={ROUTES.catalog}
              onClick={onNavigate}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-slate-100 px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200"
            >
              <BrandIcon name="catalog" className="h-4 w-4" />
              Усі товари
            </Link>
            <Link
              to={getCatalogPath(PROMO_LISTING_QUERY)}
              onClick={onNavigate}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-amber-400 px-4 text-sm font-semibold text-slate-900 transition-colors hover:bg-amber-300"
            >
              <BrandIcon name="tag" className="h-4 w-4" />
              Акції тижня
            </Link>
          </div>
        </nav>
      </div>
    );
  },
);

export default MegaMenu;
