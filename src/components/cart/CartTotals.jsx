import { PRODUCT_FORMS, formatPrice, pluralize } from '../../lib/format';
import { cn } from '../../lib/utils';

/**
 * @param {{ totalPrice: number, totalSavings: number, totalItems?: number, className?: string }} props
 * `totalItems` adds the count to the items label.
 */
export default function CartTotals({ totalPrice, totalSavings, totalItems, className }) {
  const itemsLabel = totalItems !== undefined ? ` (${pluralize(totalItems, PRODUCT_FORMS)})` : '';

  return (
    <dl className={cn('space-y-2 text-sm', className)}>
      {totalSavings > 0 && (
        <>
          <div className="flex justify-between gap-3 text-slate-700">
            <dt>Товари без знижок{itemsLabel}</dt>
            <dd className="tabular-nums">{formatPrice(totalPrice + totalSavings)}</dd>
          </div>
          <div className="flex justify-between gap-3 font-semibold text-emerald-800">
            <dt>Ваша економія</dt>
            <dd className="tabular-nums">−{formatPrice(totalSavings)}</dd>
          </div>
        </>
      )}
      <div className="flex items-baseline justify-between gap-3 border-t border-slate-100 pt-3 text-slate-900">
        <dt className="text-base font-semibold">Разом{totalSavings === 0 && itemsLabel}</dt>
        <dd className="text-2xl font-extrabold tabular-nums">{formatPrice(totalPrice)}</dd>
      </div>
    </dl>
  );
}
