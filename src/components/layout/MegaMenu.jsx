import { forwardRef } from 'react';
import { LayoutGrid, Tag } from 'lucide-react';
import CategoryIcon from '../ui/CategoryIcon';

/**
 * @typedef {Object} MegaMenuProps
 * @property {string} id
 * @property {import('../../services/productService').Category[]} categories
 * @property {boolean} isLoading
 * @property {(categoryId: string | null) => void} onSelectCategory
 * @property {() => void} onShowPromos
 */

const MegaMenu = forwardRef(
  /** @param {MegaMenuProps} props */
  function MegaMenu({ id, categories, isLoading, onSelectCategory, onShowPromos }, ref) {
    return (
      <div
        id={id}
        ref={ref}
        className="absolute inset-x-0 top-full max-h-[calc(100dvh-8rem)] animate-fade-in overflow-y-auto border-b border-slate-200 bg-white shadow-xl"
      >
        <nav aria-label="Категорії каталогу" className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4" aria-busy="true">
              {Array.from({ length: 8 }, (_, index) => (
                <div key={index} className="skeleton h-16 rounded-2xl" />
              ))}
            </div>
          ) : (
            <ul className="grid grid-cols-1 gap-2 min-[400px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {categories.map((category) => (
                <li key={category.id}>
                  <button
                    type="button"
                    onClick={() => onSelectCategory(category.id)}
                    className="flex w-full items-center gap-3 rounded-2xl p-3 text-left transition-colors hover:bg-emerald-50"
                  >
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
                      <CategoryIcon name={category.icon} className="h-5 w-5" />
                    </span>
                    <span className="text-sm font-medium text-slate-800">{category.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={() => onSelectCategory(null)}
              className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200"
            >
              <LayoutGrid className="h-4 w-4" aria-hidden="true" />
              Усі товари
            </button>
            <button
              type="button"
              onClick={onShowPromos}
              className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-900 transition-colors hover:bg-amber-300"
            >
              <Tag className="h-4 w-4" aria-hidden="true" />
              Акції тижня
            </button>
          </div>
        </nav>
      </div>
    );
  },
);

export default MegaMenu;
