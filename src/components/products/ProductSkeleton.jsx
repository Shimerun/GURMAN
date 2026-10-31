export default function ProductSkeleton() {
  return (
    <div className="flex h-full flex-col rounded-lg bg-white p-3 shadow-soft ring-1 ring-slate-100 sm:p-4" aria-hidden="true">
      <div className="skeleton aspect-square w-full rounded-lg" />
      <div className="mt-3 flex justify-between gap-2">
        <div className="skeleton h-3 w-16 rounded" />
        <div className="skeleton h-3 w-10 rounded" />
      </div>
      <div className="skeleton mt-2 h-4 w-full rounded" />
      <div className="skeleton mt-1.5 h-4 w-2/3 rounded" />
      <div className="skeleton mt-2 h-5 w-24 rounded-full" />
      <div className="skeleton mt-4 h-6 w-20 rounded" />
      <div className="skeleton mt-3 h-10 w-full rounded-lg" />
    </div>
  );
}
