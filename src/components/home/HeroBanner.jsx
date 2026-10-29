import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { HERO_SLIDES } from '../../data/heroSlides';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { cn } from '../../lib/utils';
import SafeImage from '../ui/SafeImage';

const AUTOPLAY_INTERVAL_MS = 5000;

/** @param {{ onSelectCategory: (categoryId: string | null) => void }} props */
export default function HeroBanner({ onSelectCategory }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Re-armed on every slide change so manual navigation restarts the full interval.
  useEffect(() => {
    if (isPaused || prefersReducedMotion) return undefined;
    const timeoutId = setTimeout(() => setActiveIndex((index) => (index + 1) % HERO_SLIDES.length), AUTOPLAY_INTERVAL_MS);
    return () => clearTimeout(timeoutId);
  }, [activeIndex, isPaused, prefersReducedMotion]);

  const showSlide = (index) => setActiveIndex((index + HERO_SLIDES.length) % HERO_SLIDES.length);

  const handleBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false);
  };

  return (
    <section
      aria-roledescription="карусель"
      aria-label="Пропозиції GURMAN"
      className="relative grid overflow-hidden rounded-3xl shadow-soft"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={handleBlur}
    >
      {HERO_SLIDES.map((slide, index) => {
        const isActive = index === activeIndex;
        return (
          <div
            key={slide.id}
            role="group"
            aria-roledescription="слайд"
            aria-label={`${index + 1} з ${HERO_SLIDES.length}`}
            aria-hidden={!isActive}
            className={cn(
              'relative col-start-1 row-start-1 flex min-h-[340px] items-center bg-gradient-to-br transition-opacity duration-700 sm:min-h-[380px]',
              slide.backgroundClassName,
              isActive ? 'z-10 opacity-100' : 'pointer-events-none opacity-0',
            )}
          >
            <SafeImage
              src={slide.image}
              alt={slide.imageAlt}
              isEager={index === 0}
              fetchpriority={index === 0 ? 'high' : undefined}
              className="absolute inset-0 h-full w-full object-cover opacity-25 md:left-auto md:right-0 md:w-1/2 md:rounded-l-[4rem] md:opacity-100"
            />
            <div className="relative flex w-full max-w-xl flex-col justify-center p-6 pb-16 text-white sm:p-10 sm:pb-16 md:max-w-[50%]">
              <span className="w-fit rounded-full bg-amber-400 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-900">
                {slide.eyebrow}
              </span>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">{slide.title}</h2>
              <p className="mt-3 max-w-md text-sm text-white/85 sm:text-base">{slide.description}</p>
              <button
                type="button"
                tabIndex={isActive ? 0 : -1}
                onClick={() => onSelectCategory(slide.categoryId)}
                className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-emerald-700 shadow-lg transition-colors hover:bg-amber-400 hover:text-slate-900"
              >
                {slide.ctaLabel}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        );
      })}

      <div className="absolute bottom-4 left-6 z-20 flex items-center gap-2 sm:left-10">
        {HERO_SLIDES.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => showSlide(index)}
            aria-label={`Перейти до слайду ${index + 1}`}
            aria-current={index === activeIndex}
            className={cn(
              'h-2 rounded-full transition-all duration-300',
              index === activeIndex ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/80',
            )}
          />
        ))}
      </div>

      <div className="absolute bottom-3 right-4 z-20 flex gap-2">
        <button
          type="button"
          onClick={() => showSlide(activeIndex - 1)}
          aria-label="Попередній слайд"
          className="grid h-9 w-9 place-items-center rounded-full bg-white/80 text-slate-800 backdrop-blur-md transition-colors hover:bg-white"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => showSlide(activeIndex + 1)}
          aria-label="Наступний слайд"
          className="grid h-9 w-9 place-items-center rounded-full bg-white/80 text-slate-800 backdrop-blur-md transition-colors hover:bg-white"
        >
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
