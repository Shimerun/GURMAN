import { formatPrice, getDiscountPercent } from '../../lib/format';
import { cn } from '../../lib/utils';

const SIZE_CLASSES = {
  sm: { price: 'text-base', unit: 'text-[11px]', oldPrice: 'text-[11px]', discount: 'px-1.5 py-0.5 text-[10px]' },
  md: { price: 'text-lg', unit: 'text-xs', oldPrice: 'text-xs', discount: 'px-1.5 py-0.5 text-[11px]' },
  lg: { price: 'text-3xl', unit: 'text-sm', oldPrice: 'text-base', discount: 'px-2 py-1 text-sm' },
};

/** @param {{ product: import('../../services/productService').Product, size?: keyof typeof SIZE_CLASSES, className?: string }} props */
export default function PriceTag({ product, size = 'md', className }) {
  const sizeClasses = SIZE_CLASSES[size];
  const discountPercent = product.isPromo ? getDiscountPercent(product.price, product.oldPrice) : 0;

  return (
    <div className={cn('flex flex-wrap items-baseline gap-x-1.5 gap-y-1', className)}>
      <span className={cn('font-bold leading-none', sizeClasses.price, discountPercent > 0 ? 'text-emerald-600' : 'text-slate-900')}>
        {formatPrice(product.price)}
      </span>
      <span className={cn('text-slate-500', sizeClasses.unit)}>/ {product.unit}</span>
      {discountPercent > 0 && (
        <>
          <span className={cn('text-slate-400 line-through', sizeClasses.oldPrice)}>
            <span className="sr-only">Стара ціна: </span>
            {formatPrice(product.oldPrice)}
          </span>
          <span className={cn('rounded-full bg-amber-400 font-bold leading-none text-slate-900', sizeClasses.discount)}>
            -{discountPercent}%
          </span>
        </>
      )}
    </div>
  );
}
