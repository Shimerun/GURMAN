import { RefreshCw, TriangleAlert } from 'lucide-react';
import { useEffect } from 'react';
import { Link, useRouteError } from 'react-router-dom';
import { buttonClassName } from '../lib/buttonStyles';
import { ROUTES } from '../lib/routes';

/** Render-time crash inside a page. The site layout stays usable around it. */
export default function RouteErrorPage() {
  const error = useRouteError();

  useEffect(() => {
    console.error('Route render failed', error);
  }, [error]);

  return (
    <div role="alert" className="flex flex-col items-center rounded-2xl bg-red-50 px-6 py-16 text-center ring-1 ring-red-100">
      <span className="grid h-14 w-14 place-items-center rounded-full bg-red-100 text-red-600">
        <TriangleAlert className="h-7 w-7" aria-hidden="true" />
      </span>
      <h1 className="mt-4 text-xl font-bold text-slate-900">Щось пішло не так</h1>
      <p className="mt-1 max-w-md text-sm text-slate-600">
        Не вдалося показати цю сторінку. Спробуйте оновити її — кошик збережеться.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={() => window.location.reload()} className={buttonClassName()}>
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Оновити сторінку
        </button>
        <Link to={ROUTES.home} className={buttonClassName({ variant: 'secondary' })}>
          На головну
        </Link>
      </div>
    </div>
  );
}
