import { LayoutGrid } from 'lucide-react';
import CategoryIcon from '../ui/CategoryIcon';
import FilterPill from '../ui/FilterPill';

const SKELETON_PILL_COUNT = 6;

/**
 * @param {{
 *   categories: import('../../services/productService').Category[],
 *   isLoading: boolean,
 *   selectedCategory: string | null,
 *   onSelectCategory: (categoryId: string | null) => void,
 *   ariaLabel?: string,
 * }} props
 */
export default function CategoryGrid({ categories, isLoading, selectedCategory, onSelectCategory, ariaLabel = 'Категорії' }) {
  if (isLoading) {
    return (
      <div className="flex gap-2 overflow-hidden" aria-busy="true" aria-label="Завантаження категорій">
        {Array.from({ length: SKELETON_PILL_COUNT }, (_, index) => (
          <div key={index} className="skeleton h-10 w-36 shrink-0 rounded-full" />
        ))}
      </div>
    );
  }

  return (
    <ul
      aria-label={ariaLabel}
      className="scrollbar-hide -mx-4 flex snap-x gap-2 overflow-x-auto px-4 py-1 sm:mx-0 sm:px-0 lg:flex-wrap lg:overflow-visible"
    >
      <li className="shrink-0">
        <FilterPill isActive={selectedCategory === null} onClick={() => onSelectCategory(null)}>
          <LayoutGrid className="h-4 w-4" aria-hidden="true" />
          Усі
        </FilterPill>
      </li>
      {categories.map((category) => (
        <li key={category.id} className="shrink-0">
          <FilterPill isActive={selectedCategory === category.id} onClick={() => onSelectCategory(category.id)}>
            <CategoryIcon name={category.icon} className="h-4 w-4" />
            {category.title}
          </FilterPill>
        </li>
      ))}
    </ul>
  );
}
