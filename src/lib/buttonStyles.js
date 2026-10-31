import { cn } from './utils';

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-[color,background-color,box-shadow,transform] duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 disabled:shadow-none disabled:ring-0 motion-reduce:active:scale-100';

// emerald-700, not 600: white text on emerald-600 is only 3.8:1, below WCAG AA for button labels.
const VARIANTS = {
  primary: 'bg-emerald-700 text-white hover:bg-emerald-800 active:bg-emerald-900',
  secondary: 'bg-white text-slate-800 ring-1 ring-slate-200 hover:text-emerald-800 hover:ring-emerald-500',
  accent: 'bg-amber-400 text-slate-900 hover:bg-amber-300',
  ghost: 'text-emerald-800 hover:bg-emerald-50',
  onDark: 'text-white ring-1 ring-white/50 hover:bg-white/10',
};

// `cn` is a plain join (no tailwind-merge): callers must not pass conflicting h-/px- utilities.
// Every size keeps the 44px minimum touch target.
const SIZES = {
  sm: 'h-11 px-4 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-base',
};

/**
 * Shared look for buttons and button-styled links.
 * @param {{ variant?: keyof typeof VARIANTS, size?: keyof typeof SIZES, className?: string }} [options]
 */
export const buttonClassName = ({ variant = 'primary', size = 'md', className } = {}) =>
  cn(BASE, VARIANTS[variant], SIZES[size], className);
