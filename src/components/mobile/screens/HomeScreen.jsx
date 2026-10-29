import { ArrowRight, ChevronRight, Info, Truck } from 'lucide-react';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { HERO_SLIDES } from '../../../data/heroSlides';
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion';
import { useProducts } from '../../../hooks/useProducts';
import { FREE_DELIVERY_THRESHOLD } from '../../../lib/constants';
import { cn } from '../../../lib/utils';
import { useUIStore } from '../../../store/useUIStore';
import CategoryIcon from '../../ui/CategoryIcon';
import ErrorState from '../../ui/ErrorState';
import SafeImage from '../../ui/SafeImage';
import InstallBanner from '../InstallBanner';
import MobileProductCard from '../MobileProductCard';
import MobileProductSkeleton from '../MobileProductSkeleton';

const PROMO_QUERY = { onlyPromo: true, sort: 'discount' };
const MAX_PROMO_RAIL_ITEMS = 10;
const EAGER_IMAGE_COUNT = 4;
const RAIL_CLASS_NAME = 'scrollbar-hide -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4';

function SectionTitle({ id, title, action }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 id={id} className="text-xl font-bold tracking-tight text-slate-900">
        {title}
      </h2>
      {action}
    </div>
  );
}

function HeroCarousel({ onSelectCategory }) {
  const railRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  const getSlideStep = () => {
    const rail = railRef.current;
    const firstSlide = rail?.firstElementChild;
    if (!rail || !firstSlide) return 1;
    const gap = parseFloat(getComputedStyle(rail).columnGap) || 0;
    return firstSlide.getBoundingClientRect().width + gap;
  };

  const handleScroll = () => {
    const index = Math.round(railRef.current.scrollLeft / getSlideStep());
    setActiveIndex(Math.min(Math.max(index, 0), HERO_SLIDES.length - 1));
  };

  const scrollToSlide = (index) => {
    railRef.current?.scrollTo({ left: index * getSlideStep(), behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  };

  return (
    <section aria-roledescription="карусель" aria-label="Пропозиції GURMAN">
      <div ref={railRef} onScroll={handleScroll} className={RAIL_CLASS_NAME}>
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            role="group"
            aria-roledescription="слайд"
            aria-label={`${index + 1} з ${HERO_SLIDES.length}`}
            className="relative aspect-[16/11] w-full shrink-0 snap-start overflow-hidden rounded-3xl bg-emerald-800 shadow-soft"
          >
            <SafeImage
              src={slide.mobileImage}
              alt={slide.imageAlt}
              isEager={index === 0}
              fetchpriority={index === 0 ? 'high' : undefined}
              width={800}
              height={550}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/45 to-transparent" aria-hidden="true" />
            <div className="absolute inset-x-0 bottom-0 p-4 text-white">
              <span className="rounded-full bg-amber-400 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-slate-900">
                {slide.eyebrow}
              </span>
              <h3 className="mt-2 text-xl font-extrabold leading-tight">{slide.title}</h3>
              <button
                type="button"
                onClick={() => onSelectCategory(slide.categoryId)}
                className="mt-3 inline-flex min-h-11 items-center gap-1.5 rounded-full bg-white px-4 text-sm font-semibold text-emerald-700 active:scale-95"
              >
                {slide.ctaLabel}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-1 flex justify-center">
        {HERO_SLIDES.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => scrollToSlide(index)}
            aria-label={`Перейти до слайду ${index + 1}`}
            aria-current={index === activeIndex}
            className="grid min-h-11 min-w-11 place-items-center"
          >
            <span
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                index === activeIndex ? 'w-6 bg-emerald-600' : 'w-2 bg-slate-300',
              )}
            />
          </button>
        ))}
      </div>
    </section>
  );
}

function CategoryRail({ categories, isLoading, onSelectCategory }) {
  return (
    <section aria-labelledby="mobile-categories-heading">
      <SectionTitle id="mobile-categories-heading" title="Категорії" />
      <ul className={RAIL_CLASS_NAME} aria-busy={isLoading}>
        {isLoading
          ? Array.from({ length: 5 }, (_, index) => (
              <li key={index} className="flex w-20 shrink-0 flex-col items-center gap-2" aria-hidden="true">
                <div className="skeleton h-16 w-16 rounded-full" />
                <div className="skeleton h-3 w-14 rounded" />
              </li>
            ))
          : categories.map((category) => (
              <li key={category.id} className="w-20 shrink-0 snap-start">
                <button
                  type="button"
                  onClick={() => onSelectCategory(category.id)}
                  className="flex w-full flex-col items-center gap-1.5 active:scale-95"
                >
                  <span className="grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                    <CategoryIcon name={category.icon} className="h-7 w-7" />
                  </span>
                  <span className="line-clamp-2 text-center text-xs font-medium leading-tight text-slate-700">{category.title}</span>
                </button>
              </li>
            ))}
      </ul>
    </section>
  );
}

function PromoRail() {
  const setTab = useUIStore((state) => state.setTab);
  const { data, isLoading, isFetching, error, refetch } = useProducts(PROMO_QUERY);
  const promoProducts = data.slice(0, MAX_PROMO_RAIL_ITEMS);

  if (!isLoading && !error && promoProducts.length === 0) return null;

  return (
    <section aria-labelledby="mobile-promo-heading">
      <SectionTitle
        id="mobile-promo-heading"
        title="Акції тижня"
        action={
          <button
            type="button"
            onClick={() => setTab('promo')}
            className="-mr-2 inline-flex min-h-11 items-center gap-0.5 rounded-full px-2 text-sm font-semibold text-emerald-700 active:scale-95"
          >
            Усі
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        }
      />

      {error ? (
        <ErrorState title="Не вдалося завантажити акції" onRetry={refetch} buttonClassName="min-h-11 active:scale-95" />
      ) : (
        <ul
          className={cn(RAIL_CLASS_NAME, 'pb-1 transition-opacity', isFetching && !isLoading && 'opacity-60')}
          aria-busy={isLoading || isFetching}
        >
          {isLoading
            ? Array.from({ length: 3 }, (_, index) => (
                <li key={index} className="w-[150px] shrink-0">
                  <MobileProductSkeleton />
                </li>
              ))
            : promoProducts.map((product, index) => (
                <li key={product.id} className="w-[150px] shrink-0 snap-start">
                  <MobileProductCard product={product} isImageEager={index < EAGER_IMAGE_COUNT} />
                </li>
              ))}
        </ul>
      )}
    </section>
  );
}

const showLoyaltyInfo = () =>
  toast('Онлайн-оформлення картки скоро запрацює. Поки що картку можна отримати на касі будь-якого магазину.', {
    icon: <Info className="h-5 w-5 shrink-0 text-sky-600" aria-hidden="true" />,
    duration: 4000,
  });

/**
 * @param {{
 *   categories: import('../../../services/productService').Category[],
 *   isCategoriesLoading: boolean,
 *   onSelectCategory: (categoryId: string | null) => void,
 * }} props
 */
export default function HomeScreen({ categories, isCategoriesLoading, onSelectCategory }) {
  return (
    <div className="space-y-7 px-4 pt-4">
      <HeroCarousel onSelectCategory={onSelectCategory} />

      <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 p-3 ring-1 ring-emerald-100">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald-600 text-white">
          <Truck className="h-5 w-5" aria-hidden="true" />
        </span>
        <p className="text-sm">
          <span className="block font-semibold text-emerald-900">Безкоштовна доставка від ₴ {FREE_DELIVERY_THRESHOLD}</span>
          <span className="text-emerald-800/80">Привеземо за 2 години</span>
        </p>
      </div>

      <InstallBanner />
      <CategoryRail categories={categories} isLoading={isCategoriesLoading} onSelectCategory={onSelectCategory} />
      <PromoRail />

      <section aria-labelledby="mobile-loyalty-heading" className="relative overflow-hidden rounded-3xl bg-slate-900 p-5 text-white shadow-soft">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-emerald-500/30" aria-hidden="true" />
        <p className="relative text-xs font-semibold uppercase tracking-wider text-emerald-400">Програма лояльності</p>
        <h2 id="mobile-loyalty-heading" className="relative mt-1 text-xl font-bold">
          Картка GURMAN
        </h2>
        <p className="relative mt-1 text-sm text-white/70">Бонуси за кожну покупку, персональні знижки та подарунок до дня народження.</p>
        <button
          type="button"
          onClick={showLoyaltyInfo}
          className="relative mt-4 min-h-11 rounded-full bg-white/10 px-5 text-sm font-semibold text-white ring-1 ring-white/20 active:scale-95"
        >
          Дізнатися більше
        </button>
      </section>
    </div>
  );
}
