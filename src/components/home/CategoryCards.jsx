import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCategories } from '../../hooks/useProducts';
import { buttonClassName } from '../../lib/buttonStyles';
import { SECTION_IDS } from '../../lib/constants';
import { PRODUCT_FORMS, pluralize } from '../../lib/format';
import { ROUTES, getCategoryPath } from '../../lib/routes';
import CategoryIcon from '../ui/CategoryIcon';
import ErrorState from '../ui/ErrorState';
import SafeImage from '../ui/SafeImage';
import SectionHeader from '../ui/SectionHeader';

const GRID_CLASS_NAME = 'grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3';

export default function CategoryCards() {
  const { data: categories, isLoading, error, refetch } = useCategories();

  return (
    <section id={SECTION_IDS.categories} aria-labelledby="categories-heading">
      <SectionHeader id="categories-heading" eyebrow="Що шукаєте?" title="Категорії товарів">
        <Link
          to={ROUTES.catalog}
          className={buttonClassName({ variant: 'ghost', size: 'sm' })}
        >
          Весь каталог
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </SectionHeader>

      {isLoading ? (
        <ul className={GRID_CLASS_NAME} aria-busy="true" aria-label="Завантаження категорій">
          {Array.from({ length: 6 }, (_, index) => (
            <li key={index} className="skeleton h-36 rounded-2xl sm:h-48" />
          ))}
        </ul>
      ) : error && categories.length === 0 ? (
        <ErrorState title="Не вдалося завантажити категорії" onRetry={refetch} />
      ) : (
        <ul className={GRID_CLASS_NAME}>
          {categories.map((category) => (
            <li key={category.id} className="scroll-reveal">
              <Link
                to={getCategoryPath(category.id)}
                className="group relative flex h-full min-h-36 overflow-hidden rounded-2xl bg-emerald-900 p-4 text-white shadow-soft ring-1 ring-slate-100 transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:min-h-48 sm:p-5"
              >
                <SafeImage
                  src={category.image}
                  alt=""
                  width={800}
                  height={500}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/65 to-slate-950/20" aria-hidden="true" />
                <span className="relative mt-auto flex w-full flex-col">
                  <span className="hidden h-10 w-10 place-items-center rounded-xl bg-white/15 backdrop-blur-sm sm:grid">
                    <CategoryIcon name={category.icon} className="h-5 w-5" />
                  </span>
                  <span className="mt-3 flex items-center justify-between gap-2">
                    <span className="text-base font-bold leading-tight sm:text-lg">{category.title}</span>
                    <ArrowRight
                      className="h-5 w-5 shrink-0 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
                      aria-hidden="true"
                    />
                  </span>
                  <span className="mt-1 hidden text-sm text-white/90 sm:line-clamp-2">{category.description}</span>
                  <span className="mt-1.5 text-xs font-semibold uppercase tracking-wide text-amber-300">
                    {pluralize(category.productCount, PRODUCT_FORMS)}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
