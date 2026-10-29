import { cn } from '../../lib/utils';

const STOCK_BADGES = {
  in_stock: { label: 'В наявності', className: 'bg-emerald-100 text-emerald-700' },
  low_stock: { label: 'Закінчується', className: 'bg-amber-100 text-amber-800' },
  out_of_stock: { label: 'Немає в наявності', className: 'bg-red-100 text-red-700' },
};

/** @param {{ status: import('../../services/productService').StockStatus, className?: string }} props */
export default function StockBadge({ status, className }) {
  const badge = STOCK_BADGES[status];
  return (
    <span className={cn('badge badge-sm h-auto border-0 py-0.5 font-medium', badge.className, className)}>{badge.label}</span>
  );
}
