import { ArrowLeft, MapPin, ShieldCheck, Store, Tag, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import CartItem from '../components/cart/CartItem';
import CartTotals from '../components/cart/CartTotals';
import PrintListButton from '../components/cart/PrintListButton';
import ShareListButton from '../components/cart/ShareListButton';
import BasketIllustration from '../components/ui/BasketIllustration';
import EmptyState from '../components/ui/EmptyState';
import PageHeader from '../components/ui/PageHeader';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { STATIC_PAGE_META } from '../lib/pageMeta';
import { useHasMounted } from '../hooks/useHasMounted';
import { buttonClassName } from '../lib/buttonStyles';
import { IN_CITY, PROMO_LISTING_QUERY } from '../lib/constants';
import { PRODUCT_FORMS, pluralize } from '../lib/format';
import { ROUTES, getCatalogPath } from '../lib/routes';
import { selectTotalItems, selectTotalPrice, selectTotalSavings, useCartStore } from '../store/useCartStore';

const CART_CRUMBS = [{ label: 'Кошик' }];


export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const totalItems = useCartStore(selectTotalItems);
  const totalPrice = useCartStore(selectTotalPrice);
  const totalSavings = useCartStore(selectTotalSavings);
  const hasMounted = useHasMounted();

  useDocumentTitle(STATIC_PAGE_META.cart.title, STATIC_PAGE_META.cart.description);

  // Persisted cart is read synchronously, but waiting one frame matches the header badge and avoids a flash.
  if (!hasMounted) return <PageHeader title="Кошик" breadcrumbs={CART_CRUMBS} />;

  if (items.length === 0) {
    return (
      <>
        <PageHeader title="Кошик" breadcrumbs={CART_CRUMBS} />
        <EmptyState
          illustration={<BasketIllustration variant="empty" />}
          title="Кошик порожній"
          headingAs="h2"
          description="Почніть з акцій тижня або загляньте в каталог — кошик збережеться, навіть якщо ви закриєте сторінку."
          className="py-16"
          action={
            <div className="flex flex-wrap justify-center gap-3">
              <Link to={getCatalogPath(PROMO_LISTING_QUERY)} className={buttonClassName({ variant: 'accent', size: 'lg' })}>
                <Tag className="h-5 w-5" aria-hidden="true" />
                Акції тижня
              </Link>
              <Link to={ROUTES.catalog} className={buttonClassName({ size: 'lg' })}>
                Перейти до каталогу
              </Link>
              <Link to={ROUTES.contacts} className={buttonClassName({ variant: 'secondary', size: 'lg' })}>
                <MapPin className="h-5 w-5" aria-hidden="true" />
                Магазини
              </Link>
            </div>
          }
        />
      </>
    );
  }

  return (
    <>
      <PageHeader title="Кошик" breadcrumbs={CART_CRUMBS} description={`У кошику ${pluralize(totalItems, PRODUCT_FORMS)}.`}>
        <button
          type="button"
          onClick={clearCart}
          className="inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          Очистити кошик
        </button>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start lg:gap-8">
        <section aria-labelledby="cart-items-heading" className="rounded-2xl bg-white px-4 shadow-soft ring-1 ring-slate-100 sm:px-6">
          <h2 id="cart-items-heading" className="sr-only">
            Товари в кошику
          </h2>
          <ul className="divide-y divide-slate-100">
            {items.map((item) => (
              <CartItem key={item.product.id} item={item} />
            ))}
          </ul>
        </section>

        <aside aria-labelledby="order-summary-heading" className="space-y-3 lg:sticky lg:top-36">
          <div className="rounded-2xl bg-white p-5 shadow-soft ring-2 ring-emerald-100 sm:p-6">
            <h2 id="order-summary-heading" className="text-lg font-bold text-slate-900">
              Підсумок
            </h2>
            <CartTotals totalPrice={totalPrice} totalSavings={totalSavings} totalItems={totalItems} className="mt-4" />

            <ShareListButton className="mt-5 w-full" />
            <PrintListButton className="mt-2 w-full" />
            <p className="mt-2 text-center text-xs text-slate-600">Список зберігається на цьому пристрої — відкрийте його в магазині.</p>
          </div>

          <div className="rounded-2xl bg-emerald-50 p-5 text-sm text-emerald-950 ring-1 ring-emerald-100">
            <p className="flex items-center gap-2 font-bold">
              <Store className="h-5 w-5 text-emerald-700" aria-hidden="true" />
              Як отримати товари
            </p>
            <p className="mt-1.5 leading-relaxed">
              Купуйте ці товари в будь-якому з двох магазинів GURMAN {IN_CITY} — ціни такі самі, як на сайті.
            </p>
            <Link to={ROUTES.contacts} className={buttonClassName({ variant: 'secondary', size: 'sm', className: 'mt-3' })}>
              <MapPin className="h-4 w-4" aria-hidden="true" />
              Адреси та маршрут
            </Link>
          </div>

          <p className="flex items-center gap-2 px-1 text-sm text-slate-600">
            <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-700" aria-hidden="true" />
            Заміна або повернення грошей, якщо товар не сподобався
          </p>

          <Link to={ROUTES.catalog} className={buttonClassName({ variant: 'ghost', size: 'sm' })}>
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Продовжити покупки
          </Link>
        </aside>
      </div>
    </>
  );
}
