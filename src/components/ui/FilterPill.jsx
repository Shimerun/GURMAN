import { cn } from '../../lib/utils';

const SIZE_CLASSES = {
  md: 'px-4 py-2 text-sm',
  sm: 'px-3 py-1.5 text-xs',
};

/** @param {{ isActive: boolean, onClick: () => void, children: import('react').ReactNode, className?: string, size?: keyof typeof SIZE_CLASSES }} props */
export default function FilterPill({ isActive, onClick, children, className, size = 'md' }) {
  return (
    <button
      type="button"
      aria-pressed={isActive}
      onClick={onClick}
      className={cn(
        'flex shrink-0 snap-start items-center gap-2 whitespace-nowrap rounded-full border font-medium transition-colors',
        SIZE_CLASSES[size],
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
