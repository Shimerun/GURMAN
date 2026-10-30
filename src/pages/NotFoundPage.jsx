import Breadcrumbs from '../components/ui/Breadcrumbs';
import NotFoundState from '../components/ui/NotFoundState';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function NotFoundPage() {
  useDocumentTitle('Сторінку не знайдено');

  return (
    <>
      <Breadcrumbs items={[{ label: 'Помилка 404' }]} className="mb-6" />
      <NotFoundState
        title="Сторінку не знайдено"
        description="Схоже, такої сторінки не існує або її перемістили. Перевірте адресу чи перейдіть до каталогу."
      />
    </>
  );
}
