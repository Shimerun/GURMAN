import { RefreshCw, TriangleAlert } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function ErrorState({ title, onRetry, buttonClassName }) {
  return (
    <div role="alert" className="flex flex-col items-center rounded-2xl bg-red-50 px-6 py-12 text-center ring-1 ring-red-100">
      <span className="grid h-14 w-14 place-items-center rounded-full bg-red-100 text-red-600">
        <TriangleAlert className="h-7 w-7" aria-hidden="true" />
      </span>
      <h3 className="mt-4 text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-600">Перевірте з’єднання з інтернетом і спробуйте ще раз.</p>
      <button
        type="button"
        onClick={onRetry}
        className={cn(
          'mt-5 inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-700',
          buttonClassName,
        )}
      >
        <RefreshCw className="h-4 w-4" aria-hidden="true" />
        Спробувати ще раз
      </button>
    </div>
  );
}
