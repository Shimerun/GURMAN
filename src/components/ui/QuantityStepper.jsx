import { Minus, Plus } from 'lucide-react';
import { cn } from '../../lib/utils';

const SIZE_CLASSES = {
  lg: { button: 'h-11 w-11 active:scale-95', icon: 'h-5 w-5', value: 'text-base' },
  md: { button: 'h-8 w-8', icon: 'h-4 w-4', value: 'text-sm' },
  sm: { button: 'h-7 w-7', icon: 'h-3.5 w-3.5', value: 'text-sm' },
};

/**
 * @param {{
 *   quantity: number,
 *   maxQuantity: number,
 *   onChange: (quantity: number) => void,
 *   productTitle: string,
 *   minQuantity?: number,
 *   size?: keyof typeof SIZE_CLASSES,
 *   className?: string,
 * }} props `minQuantity` 0 means "minus at 1 removes from cart"; ≥1 picks a quantity and disables minus at the floor.
 */
export default function QuantityStepper({
  quantity,
  maxQuantity,
  onChange,
  productTitle,
  minQuantity = 0,
  size = 'md',
  className,
}) {
  const sizeClasses = SIZE_CLASSES[size];
  const isAtMax = quantity >= maxQuantity;
  const isRemoval = minQuantity === 0 && quantity === 1;
  const buttonClassName = cn(
    'grid place-items-center rounded-full bg-white text-emerald-700 shadow-sm transition-colors hover:bg-emerald-600 hover:text-white disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none',
    sizeClasses.button,
  );

  return (
    <div
      role="group"
      aria-label={`Кількість: ${productTitle}`}
      className={cn('flex items-center justify-between gap-2 rounded-full bg-emerald-50 p-1 ring-1 ring-emerald-100', className)}
    >
      <button
        type="button"
        onClick={() => onChange(quantity - 1)}
        disabled={quantity <= minQuantity}
        aria-label={isRemoval ? `Видалити «${productTitle}» з кошика` : `Зменшити кількість «${productTitle}»`}
        className={buttonClassName}
      >
        <Minus className={sizeClasses.icon} aria-hidden="true" />
      </button>
      <span className={cn('min-w-[2ch] text-center font-semibold tabular-nums text-slate-900', sizeClasses.value)} aria-live="polite">
        {quantity}
      </span>
      <button
        type="button"
        onClick={() => onChange(quantity + 1)}
        disabled={isAtMax}
        aria-label={`Збільшити кількість «${productTitle}»`}
        title={isAtMax ? `Доступно лише ${maxQuantity}` : undefined}
        className={buttonClassName}
      >
        <Plus className={sizeClasses.icon} aria-hidden="true" />
      </button>
    </div>
  );
}
