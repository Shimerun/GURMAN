import { cn } from '../../lib/utils';

/** @type {Record<import('../../services/productService').ProductBadge, { label: string, className: string }>} */
const BADGES = {
  sale: { label: 'Акція', className: 'bg-amber-400 text-slate-900' },
  popular: { label: 'Хіт продажів', className: 'bg-emerald-600 text-white' },
};

/** @param {{ badges: import('../../services/productService').ProductBadge[], className?: string }} props */
export default function ProductBadges({ badges, className }) {
  if (badges.length === 0) return null;

  return (
    <ul className={cn('flex flex-wrap gap-1.5', className)} aria-label="Позначки товару">
      {badges.map((badge) => (
        <li key={badge} className={cn('rounded-full px-2.5 py-1 text-[11px] font-bold leading-none shadow-sm', BADGES[badge].className)}>
          {BADGES[badge].label}
        </li>
      ))}
    </ul>
  );
}
