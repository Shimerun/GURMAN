import { cn } from '../../lib/utils';

export default function FilterPill({ isActive, onClick, children, className }) {
  return (
    <button
      type="button"
      aria-pressed={isActive}
      onClick={onClick}
      className={cn(
        'flex shrink-0 snap-start items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors',
        isActive
          ? 'border-emerald-600 bg-emerald-600 text-white shadow-sm'
          : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-400 hover:text-emerald-700',
        className,
      )}
    >
      {children}
    </button>
  );
}
