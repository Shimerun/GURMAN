import { ArrowRight, Search, X } from 'lucide-react';
import { useEffect, useId, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../hooks/useDebounce';
import { MIN_SUGGESTION_QUERY_LENGTH, useProductSuggestions } from '../../hooks/useProducts';
import { useTypingPlaceholder } from '../../hooks/useTypingPlaceholder';
import { SEARCH_SUGGESTIONS } from '../../lib/constants';
import { PRODUCT_FORMS, formatPrice, pluralize } from '../../lib/format';
import { getCatalogPath, getProductPath } from '../../lib/routes';
import { THUMBNAIL_WIDTH } from '../../lib/imageSizes';
import { cn, withImageWidth } from '../../lib/utils';
import SafeImage from '../ui/SafeImage';

const SEARCH_PLACEHOLDER = 'Знайти продукти: молоко, сир, банани…';
const MAX_SUGGESTIONS = 6;
const SUGGESTION_DEBOUNCE_MS = 150;
const LOCALE = 'uk-UA';

/**
 * Bolds the part of `title` that matches the query, so the eye finds why a product is listed.
 * @param {{ title: string, query: string }} props
 */
function HighlightedTitle({ title, query }) {
  const start = title.toLocaleLowerCase(LOCALE).indexOf(query.trim().toLocaleLowerCase(LOCALE));
  if (start === -1) return title;
  const end = start + query.trim().length;
  return (
    <>
      {title.slice(0, start)}
      <mark className="bg-transparent font-bold text-slate-900">{title.slice(start, end)}</mark>
      {title.slice(end)}
    </>
  );
}

/** @param {{ isStale: boolean, hasError: boolean, query: string }} state */
function getEmptyMessage({ isStale, hasError, query }) {
  if (isStale) return 'Шукаємо…';
  if (hasError) return 'Підказки зараз недоступні — натисніть Enter, щоб шукати в каталозі';
  return `Нічого не знайдено за «${query}»`;
}

/**
 * Header search (combobox): shows matching products with price while typing; Enter or
 * "Усі результати" opens the catalog search. Arrow keys move through the suggestions.
 * @param {{ className?: string }} props
 */
export default function SearchBox({ className }) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const navigate = useNavigate();
  const listboxId = useId();
  const debouncedQuery = useDebounce(query, SUGGESTION_DEBOUNCE_MS);
  const { data: matches, isFetching, error } = useProductSuggestions(debouncedQuery);
  const placeholder = useTypingPlaceholder({
    prefix: 'Знайти: ',
    words: SEARCH_SUGGESTIONS,
    fallback: SEARCH_PLACEHOLDER,
    isPaused: isFocused || query !== '',
  });

  const trimmedQuery = query.trim();
  const isQueryLongEnough = trimmedQuery.length >= MIN_SUGGESTION_QUERY_LENGTH;
  // While the next query is in flight the previous suggestions stay (dimmed) instead of flickering.
  const isStale = isFetching || debouncedQuery !== query;
  const suggestions = matches.slice(0, MAX_SUGGESTIONS);
  // Stays open while searching ("Шукаємо…"), so arrow keys pressed meanwhile are not lost.
  const isOpen = isFocused && isQueryLongEnough;
  // Options: the products, then "all results".
  const optionCount = suggestions.length + 1;
  const getOptionId = (index) => `${listboxId}-option-${index}`;

  // New results reorder the options: a highlighted row must not silently point at another product.
  useEffect(() => {
    setActiveIndex(-1);
  }, [matches]);

  const close = () => {
    setQuery('');
    setActiveIndex(-1);
  };

  /** @param {HTMLElement | null} element Blurred so phones hide the keyboard over the results. */
  const goTo = (path, element) => {
    navigate(path);
    close();
    element?.blur();
  };

  const openCatalogSearch = (element) => {
    if (trimmedQuery) goTo(getCatalogPath({ search: trimmedQuery }), element);
  };

  /** @param {number} index @param {HTMLElement | null} element */
  const chooseOption = (index, element) => {
    if (index < suggestions.length) goTo(getProductPath(suggestions[index].id), element);
    else openCatalogSearch(element);
  };

  /** @param {import('react').FormEvent<HTMLFormElement>} event */
  const handleSubmit = (event) => {
    event.preventDefault();
    const input = event.currentTarget.querySelector('input');
    if (isOpen && activeIndex >= 0) chooseOption(activeIndex, input);
    else openCatalogSearch(input);
  };

  /** @param {import('react').KeyboardEvent<HTMLInputElement>} event */
  const handleKeyDown = (event) => {
    if (event.key === 'Escape' && query) {
      event.preventDefault();
      close();
      return;
    }
    if (!isOpen || (event.key !== 'ArrowDown' && event.key !== 'ArrowUp')) return;
    event.preventDefault();
    const step = event.key === 'ArrowDown' ? 1 : -1;
    // -1 is the input itself: moving past either end returns there, like native comboboxes.
    setActiveIndex((index) => {
      const next = index + step;
      if (next >= optionCount) return -1;
      if (next < -1) return optionCount - 1;
      return next;
    });
  };

  return (
    <form role="search" onSubmit={handleSubmit} className={cn('relative', className)}>
      <label className="relative block">
        <span className="sr-only">Пошук товарів у каталозі</span>
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" aria-hidden="true" />
        {/* text-base on mobile (16px) prevents iOS Safari from zooming into the field on focus. */}
        <input
          type="search"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={isOpen && activeIndex >= 0 ? getOptionId(activeIndex) : undefined}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          autoComplete="off"
          enterKeyHint="search"
          className="h-11 w-full rounded-full border border-slate-300 bg-slate-50 pl-12 pr-12 text-base text-slate-800 transition-colors placeholder:text-slate-500 hover:border-slate-400 focus:border-emerald-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20 md:text-sm [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <button
            type="button"
            onClick={close}
            aria-label="Очистити пошук"
            className="absolute right-1 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-800"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </label>

      <p className="sr-only" role="status">
        {isOpen && !isStale && (suggestions.length > 0 ? `Підказки: ${pluralize(matches.length, PRODUCT_FORMS)}` : 'Нічого не знайдено')}
      </p>

      {/* Options keep focus in the input (mousedown is cancelled), so the list does not close before a click lands. */}
      <ul
        id={listboxId}
        role="listbox"
        aria-label="Підказки пошуку"
        hidden={!isOpen}
        onMouseDown={(event) => event.preventDefault()}
        className={cn(
          'absolute inset-x-0 top-full z-50 mt-2 max-h-[min(28rem,70dvh)] overflow-y-auto overscroll-contain rounded-2xl bg-white p-1.5 shadow-xl ring-1 ring-slate-200',
          // Only the rows dim: a translucent panel would let the page show through.
          isStale && '[&>li]:opacity-60',
        )}
      >
        {suggestions.length === 0 && (
          <li className="px-3 py-3 text-sm text-slate-600">{getEmptyMessage({ isStale, hasError: Boolean(error), query: trimmedQuery })}</li>
        )}
        {suggestions.map((product, index) => (
          <li
            key={product.id}
            id={getOptionId(index)}
            role="option"
            aria-selected={activeIndex === index}
            onClick={(event) => chooseOption(index, event.currentTarget.closest('form')?.querySelector('input') ?? null)}
            onMouseEnter={() => setActiveIndex(index)}
            className={cn('flex cursor-pointer items-center gap-3 rounded-xl px-2 py-1.5', activeIndex === index && 'bg-emerald-50')}
          >
            <SafeImage
              src={withImageWidth(product.image, THUMBNAIL_WIDTH.suggestion)}
              alt=""
              width={48}
              height={48}
              className="h-12 w-12 shrink-0 rounded-lg bg-emerald-50 object-cover"
            />
            <span className="min-w-0 flex-1">
              <span className="line-clamp-2 text-sm text-slate-700">
                <HighlightedTitle title={product.title} query={trimmedQuery} />
              </span>
              <span className="text-xs text-slate-600">{product.categoryTitle}</span>
            </span>
            <span className="shrink-0 text-right text-sm font-bold tabular-nums text-slate-900">
              {formatPrice(product.price)}
              <span className="block text-xs font-normal text-slate-600">/ {product.unit}</span>
            </span>
          </li>
        ))}
        <li
          id={getOptionId(suggestions.length)}
          role="option"
          aria-selected={activeIndex === suggestions.length}
          onClick={(event) => openCatalogSearch(event.currentTarget.closest('form')?.querySelector('input') ?? null)}
          onMouseEnter={() => setActiveIndex(suggestions.length)}
          className={cn(
            'mt-1 flex cursor-pointer items-center justify-between gap-2 rounded-xl border-t border-slate-100 px-3 py-2.5 text-sm font-semibold text-emerald-800',
            activeIndex === suggestions.length && 'bg-emerald-50',
          )}
        >
          Усі результати для «{trimmedQuery}»
          <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
        </li>
      </ul>
    </form>
  );
}
