import { PRODUCT_FORMS, formatPrice, pluralize } from '../../lib/format';
import { cn } from '../../lib/utils';

/**
 * @param {{ totalPrice: number, totalSavings: number, totalItems?: number, className?: string }} props
 * `totalItems` adds the count to the items label.
 */
export default function CartTotals({ totalPrice, totalSavings, totalItems, className }) {
  return (
    <dl className={cn('space-y-1.5 text-sm', className)}>
      {totalSavings > 0 && (
        <>
          <div className="flex justify-between gap-3 text-slate-600">
            <dt>Товари без знижок{totalItems !== undefined && ` (${pluralize(totalItems, PRODUCT_FORMS)})`}</dt>
            <dd className="tabular-nums">{formatPrice(totalPrice + totalSavings)}</dd>
          </div>
          <div className="flex justify-between gap-3 font-medium text-emerald-700">
            <dt>Ваша економія</dt>
            <dd className="tabular-nums">−{formatPrice(totalSavings)}</dd>
          </div>
        </>
      )}
      <div className="flex justify-between gap-3 pt-1 text-base font-bold text-slate-900">
        <dt>Разом{totalSavings === 0 && totalItems !== undefined && ` (${pluralize(totalItems, PRODUCT_FORMS)})`}</dt>
        <dd className="tabular-nums">{formatPrice(totalPrice)}</dd>
      </div>
    </dl>
  );
}
