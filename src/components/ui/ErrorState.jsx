import { RefreshCw, TriangleAlert } from 'lucide-react';
import { buttonClassName } from '../../lib/buttonStyles';

/**
 * Failed request with a retry. `headingAs` lets full-page failures own the page's <h1>.
 * @param {{ title: string, onRetry: () => void, description?: string, headingAs?: 'h1' | 'h2' | 'h3' }} props
 */
export default function ErrorState({
  title,
  onRetry,
  description = 'Перевірте з’єднання з інтернетом і спробуйте ще раз. Кошик збережено.',
  headingAs: Heading = 'h3',
}) {
  return (
    <div role="alert" className="flex flex-col items-center rounded-2xl bg-red-50 px-6 py-12 text-center ring-1 ring-red-100">
      <span className="grid h-14 w-14 place-items-center rounded-full bg-red-100 text-red-700">
        <TriangleAlert className="h-7 w-7" aria-hidden="true" />
      </span>
      <Heading className="mt-4 text-lg font-semibold text-slate-900">{title}</Heading>
      <p className="mt-1 max-w-sm text-sm text-slate-700">{description}</p>
      <button type="button" onClick={onRetry} className={buttonClassName({ className: 'mt-5' })}>
        <RefreshCw className="h-4 w-4" aria-hidden="true" />
        Спробувати ще раз
      </button>
    </div>
  );
}
