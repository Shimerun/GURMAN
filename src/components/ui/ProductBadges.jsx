import { getDiscountPercent } from '../../lib/format';
import { cn } from '../../lib/utils';

/** @typedef {import('../../services/productService').Product} Product */

const BADGE_CLASSES = {
  // `badge-shine` (index.css) sweeps a glint across it once as the card scrolls into view.
  // overflow-clip, not -hidden: a hidden-overflow box is a scroll container, which freezes the glint's scroll timeline.
  sale: 'badge-shine relative overflow-clip bg-amber-400 text-slate-900',
  popular: 'bg-emerald-700 text-white',
};

/** @param {import('../../services/productService').ProductBadge} badge @param {Product} product */
function getBadgeLabel(badge, product) {
  // Phone cards share the image corner with the favourite heart, so the long label shortens there.
  if (badge === 'popular') {
    return (
      <>
        <span className="sm:hidden">Хіт</span>
        <span className="hidden sm:inline">Хіт продажів</span>
      </>
    );
  }
  const discountPercent = getDiscountPercent(product.price, product.oldPrice);
  return discountPercent > 0 ? `−${discountPercent}%` : 'Акція';
}

/**
 * Image-corner badges. On promo items the sale badge shows the actual discount, which is the
 * single place a card states it (PriceTag only strikes through the old price).
 * @param {{ product: Product, className?: string }} props
 */
export default function ProductBadges({ product, className }) {
  if (product.badges.length === 0) return null;

  return (
    <ul className={cn('flex flex-wrap gap-1.5', className)} aria-label="Позначки товару">
      {product.badges.map((badge) => (
        <li key={badge} className={cn('whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold leading-none shadow-sm', BADGE_CLASSES[badge])}>
          {badge === 'sale' && <span className="sr-only">Знижка </span>}
          {getBadgeLabel(badge, product)}
        </li>
      ))}
    </ul>
  );
}
