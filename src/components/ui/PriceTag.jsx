import { formatPrice, getDiscountPercent } from '../../lib/format';
import { cn } from '../../lib/utils';

const SIZE_CLASSES = {
  md: { price: 'text-lg', unit: 'text-xs', oldPrice: 'text-xs' },
  lg: { price: 'text-3xl sm:text-4xl', unit: 'text-base', oldPrice: 'text-lg' },
};

/**
 * Current price, sale unit and (on promo) the struck-through old price. The discount itself is
 * shown by `ProductBadges` / the product page promo line, so it isn't repeated here.
 * @param {{ product: import('../../services/productService').Product, size?: keyof typeof SIZE_CLASSES, className?: string }} props
 */
export default function PriceTag({ product, size = 'md', className }) {
  const sizeClasses = SIZE_CLASSES[size];
  const hasDiscount = product.isPromo && getDiscountPercent(product.price, product.oldPrice) > 0;

  return (
    <p className={cn('flex flex-wrap items-baseline gap-x-1.5 gap-y-1', className)}>
      <span className={cn('font-extrabold leading-none tabular-nums', sizeClasses.price, hasDiscount ? 'text-emerald-700' : 'text-slate-900')}>
        {hasDiscount && <span className="sr-only">Ціна зі знижкою: </span>}
        {formatPrice(product.price)}
      </span>
      <span className={cn('text-slate-500', sizeClasses.unit)}>/ {product.unit}</span>
      {hasDiscount && (
        <span className={cn('tabular-nums text-slate-500 line-through', sizeClasses.oldPrice)}>
          <span className="sr-only">Звичайна ціна: </span>
          {formatPrice(product.oldPrice ?? product.price)}
        </span>
      )}
    </p>
  );
}
