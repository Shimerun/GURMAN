import { cn } from '../../lib/utils';

/** @type {Record<import('../../services/productService').StockStatus, { label: string, className: string }>} */
const STOCK_BADGES = {
  in_stock: { label: 'В наявності', className: 'bg-emerald-100 text-emerald-800' },
  low_stock: { label: 'Закінчується', className: 'bg-amber-100 text-amber-900' },
  out_of_stock: { label: 'Немає в наявності', className: 'bg-red-100 text-red-800' },
};

/** @param {{ status: import('../../services/productService').StockStatus, className?: string }} props */
export default function StockBadge({ status, className }) {
  const badge = STOCK_BADGES[status];
  return <span className={cn('inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-semibold leading-none', badge.className, className)}>{badge.label}</span>;
}
