import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCategories } from '../../hooks/useProducts';
import { SECTION_IDS } from '../../lib/constants';
import { PRODUCT_FORMS, pluralize } from '../../lib/format';
import { ROUTES, getCategoryPath } from '../../lib/routes';
import CategoryIcon from '../ui/CategoryIcon';
import ErrorState from '../ui/ErrorState';
import SafeImage from '../ui/SafeImage';
import SectionHeader from '../ui/SectionHeader';

const GRID_CLASS_NAME = 'grid gap-3 min-[480px]:grid-cols-2 sm:gap-4 lg:grid-cols-3';

export default function CategoryCards() {
  const { data: categories, isLoading, error, refetch } = useCategories();

  return (
    <section id={SECTION_IDS.categories} aria-labelledby="categories-heading">
      <SectionHeader id="categories-heading" eyebrow="Що шукаєте?" title="Категорії товарів">
        <Link
          to={ROUTES.catalog}
          className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-50"
        >
          Весь каталог
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </SectionHeader>

      {isLoading ? (
        <ul className={GRID_CLASS_NAME} aria-busy="true" aria-label="Завантаження категорій">
          {Array.from({ length: 6 }, (_, index) => (
            <li key={index} className="skeleton h-44 rounded-2xl" />
          ))}
        </ul>
      ) : error && categories.length === 0 ? (
        <ErrorState title="Не вдалося завантажити категорії" onRetry={refetch} />
      ) : (
        <ul className={GRID_CLASS_NAME}>
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                to={getCategoryPath(category.id)}
                className="group relative flex h-full min-h-44 overflow-hidden rounded-2xl bg-emerald-900 p-5 text-white shadow-soft ring-1 ring-slate-100 transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                <SafeImage
                  src={category.image}
                  alt=""
                  width={800}
                  height={500}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/60 to-slate-900/10" aria-hidden="true" />
                <span className="relative mt-auto flex w-full flex-col">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 backdrop-blur-sm">
                    <CategoryIcon name={category.icon} className="h-5 w-5" />
                  </span>
                  <span className="mt-3 flex items-center justify-between gap-2">
                    <span className="text-lg font-bold leading-tight">{category.title}</span>
                    <ArrowRight
                      className="h-5 w-5 shrink-0 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
                      aria-hidden="true"
                    />
                  </span>
                  <span className="mt-1 line-clamp-2 text-sm text-white/80">{category.description}</span>
                  <span className="mt-2 text-xs font-semibold uppercase tracking-wide text-amber-300">
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
