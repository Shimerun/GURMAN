import { cn } from './utils';

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-[color,background-color,box-shadow,transform] duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none disabled:ring-0 motion-reduce:active:scale-100';

const VARIANTS = {
  primary: 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 active:bg-emerald-800',
  secondary: 'bg-white text-slate-800 shadow-sm ring-1 ring-slate-200 hover:text-emerald-700 hover:ring-emerald-400',
  accent: 'bg-amber-400 text-slate-900 shadow-sm hover:bg-amber-300',
  ghost: 'text-emerald-700 hover:bg-emerald-50',
};

// `cn` is a plain join (no tailwind-merge): callers must not pass conflicting h-/px- utilities.
const SIZES = {
  sm: 'h-10 px-4 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-base',
};

/**
 * Shared look for buttons and button-styled links.
 * @param {{ variant?: keyof typeof VARIANTS, size?: keyof typeof SIZES, className?: string }} [options]
 */
export const buttonClassName = ({ variant = 'primary', size = 'md', className } = {}) =>
  cn(BASE, VARIANTS[variant], SIZES[size], className);
