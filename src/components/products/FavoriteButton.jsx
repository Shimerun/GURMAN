import { Heart } from 'lucide-react';
import { useHasMounted } from '../../hooks/useHasMounted';
import { ANALYTICS_EVENTS, trackEvent } from '../../lib/analytics';
import { buttonClassName } from '../../lib/buttonStyles';
import { vibrateOnTap } from '../../lib/haptics';
import { cn } from '../../lib/utils';
import { selectIsFavorite, useFavoritesStore } from '../../store/useFavoritesStore';

/**
 * Heart toggle. `isLabeled` adds the text label (product page); cards use the round icon button.
 * @param {{ product: import('../../services/productService').Product, isLabeled?: boolean, className?: string }} props
 */
export default function FavoriteButton({ product, isLabeled = false, className }) {
  const isStoredFavorite = useFavoritesStore(selectIsFavorite(product.id));
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  // Persisted state is shown after mount, like the cart badge, so the first paint never flickers.
  const isFavorite = useHasMounted() && isStoredFavorite;

  const handleClick = () => {
    if (!isFavorite) {
      trackEvent(ANALYTICS_EVENTS.addFavorite);
      vibrateOnTap();
    }
    toggleFavorite(product.id);
  };

  const icon = (
    <Heart
      // Keyed so the pop replays each time the heart fills.
      key={String(isFavorite)}
      className={cn('h-5 w-5 transition-colors', isFavorite ? 'animate-badge-pop fill-red-500 text-red-500' : 'text-slate-700')}
      aria-hidden="true"
    />
  );

  if (isLabeled) {
    return (
      <button type="button" onClick={handleClick} className={buttonClassName({ variant: 'secondary', size: 'sm', className })}>
        {icon}
        {isFavorite ? 'В обраному' : 'В обране'}
      </button>
    );
  }

  // 44px touch target around a smaller visible circle, so the heart does not crowd the photo.
  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={isFavorite}
      aria-label={`Обране: ${product.title}`}
      className={cn('group/favorite grid h-11 w-11 place-items-center rounded-full', className)}
    >
      <span className="grid h-9 w-9 place-items-center rounded-full bg-white/90 shadow-sm ring-1 ring-slate-200 transition-transform group-hover/favorite:scale-105 group-active/favorite:scale-95 motion-reduce:transition-none motion-reduce:group-hover/favorite:scale-100">
        {icon}
      </span>
    </button>
  );
}
