import { Link } from 'react-router-dom';
import { buttonClassName } from '../../lib/buttonStyles';
import { ROUTES } from '../../lib/routes';
import BasketIllustration from './BasketIllustration';
import BrandIcon from './BrandIcon';
import EmptyState from './EmptyState';

/**
 * Shared "nothing here" body for the 404 route and for unknown category / product ids.
 * @param {{ title: string, description: string }} props
 */
export default function NotFoundState({ title, description }) {
  return (
    <EmptyState
      illustration={<BasketIllustration variant="spilled" />}
      title={title}
      description={description}
      className="py-16"
      headingAs="h1"
      action={
        <div className="flex flex-wrap justify-center gap-3">
          <Link to={ROUTES.catalog} className={buttonClassName()}>
            <BrandIcon name="catalog" className="h-4 w-4" />
            Перейти до каталогу
          </Link>
          <Link to={ROUTES.home} className={buttonClassName({ variant: 'secondary' })}>
            На головну
          </Link>
        </div>
      }
    />
  );
}
