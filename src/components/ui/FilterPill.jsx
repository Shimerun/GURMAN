import { cn } from '../../lib/utils';

const SIZE_CLASSES = {
  md: 'min-h-11 px-4 text-sm',
  sm: 'min-h-9 px-3 text-xs',
};

/** @param {{ isActive: boolean, onClick: () => void, children: import('react').ReactNode, className?: string, size?: keyof typeof SIZE_CLASSES }} props */
export default function FilterPill({ isActive, onClick, children, className, size = 'md' }) {
  return (
    <button
      type="button"
      aria-pressed={isActive}
      onClick={onClick}
      className={cn(
        'flex shrink-0 snap-start items-center gap-2 whitespace-nowrap rounded-lg border font-medium transition-colors',
        SIZE_CLASSES[size],
        isActive
          ? 'border-emerald-700 bg-emerald-700 text-white shadow-sm'
          : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-500 hover:text-emerald-800',
        className,
      )}
    >
      {children}
    </button>
  );
}
