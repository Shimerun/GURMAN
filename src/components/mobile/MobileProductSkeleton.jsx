import { cn } from '../../lib/utils';

export default function MobileProductSkeleton({ className }) {
  return (
    <div className={cn('flex h-full flex-col rounded-2xl bg-white p-2.5 shadow-soft ring-1 ring-slate-100', className)} aria-hidden="true">
      <div className="skeleton aspect-square w-full rounded-xl" />
      <div className="skeleton mt-2 h-4 w-20 rounded-full" />
      <div className="skeleton mt-2 h-4 w-full rounded" />
      <div className="skeleton mt-1 h-4 w-2/3 rounded" />
      <div className="mt-3 flex items-end justify-between">
        <div className="skeleton h-5 w-14 rounded" />
        <div className="skeleton h-11 w-11 rounded-full" />
      </div>
    </div>
  );
}
