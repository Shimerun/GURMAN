import { ArrowLeft, Info, ShieldCheck, ShoppingBasket, Store, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import CartItem from '../components/cart/CartItem';
import CartTotals from '../components/cart/CartTotals';
import EmptyState from '../components/ui/EmptyState';
import PageHeader from '../components/ui/PageHeader';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useHasMounted } from '../hooks/useHasMounted';
import { CHECKOUT_UNAVAILABLE_MESSAGE, useCheckoutNotice } from '../hooks/useCheckoutNotice';
import { buttonClassName } from '../lib/buttonStyles';
import { PRODUCT_FORMS, pluralize } from '../lib/format';
import { ROUTES } from '../lib/routes';
import { IN_CITY } from '../lib/constants';
import { selectTotalItems, selectTotalPrice, selectTotalSavings, useCartStore } from '../store/useCartStore';

const CART_CRUMBS = [{ label: 'Кошик' }];

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const totalItems = useCartStore(selectTotalItems);
  const totalPrice = useCartStore(selectTotalPrice);
  const totalSavings = useCartStore(selectTotalSavings);
  const showCheckoutNotice = useCheckoutNotice();
  const hasMounted = useHasMounted();

  useDocumentTitle('Кошик');

  // Persisted cart is read synchronously, but waiting one frame matches the header badge and avoids a flash.
  if (!hasMounted) return <PageHeader title="Кошик" breadcrumbs={CART_CRUMBS} />;

  if (items.length === 0) {
    return (
      <>
        <PageHeader title="Кошик" breadcrumbs={CART_CRUMBS} />
        <EmptyState
          icon={ShoppingBasket}
          title="Кошик порожній"
          description="Додайте товари з каталогу або з акцій тижня — кошик збережеться, навіть якщо ви закриєте сторінку."
          className="py-16"
          action={
            <Link to={ROUTES.catalog} className={buttonClassName({ size: 'lg' })}>
              Перейти до каталогу
            </Link>
          }
        />
      </>
    );
  }

  return (
    <>
      <PageHeader title="Кошик" breadcrumbs={CART_CRUMBS} description={`У кошику ${pluralize(totalItems, PRODUCT_FORMS)}`}>
        <button
          type="button"
          onClick={clearCart}
          className="inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          Очистити кошик
        </button>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start lg:gap-8">
        <section aria-label="Товари в кошику" className="rounded-2xl bg-white px-4 shadow-soft ring-1 ring-slate-100 sm:px-6">
          <ul className="divide-y divide-slate-100">
            {items.map((item) => (
              <CartItem key={item.product.id} item={item} />
            ))}
          </ul>
        </section>

        <aside aria-labelledby="order-summary-heading" className="lg:sticky lg:top-36">
          <div className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100 sm:p-6">
            <h2 id="order-summary-heading" className="text-lg font-bold text-slate-900">
              Ваше замовлення
            </h2>
            <CartTotals
              totalPrice={totalPrice}
              totalSavings={totalSavings}
              totalItems={totalItems}
              className="mt-4 border-t border-slate-100 pt-4"
            />

            <button type="button" onClick={showCheckoutNotice} className={buttonClassName({ size: 'lg', className: 'mt-5 w-full' })}>
              Оформити замовлення
            </button>
            <p className="mt-3 flex gap-2 rounded-xl bg-sky-50 p-3 text-xs leading-relaxed text-sky-900">
              <Info className="h-4 w-4 shrink-0" aria-hidden="true" />
              {CHECKOUT_UNAVAILABLE_MESSAGE}
            </p>

            <ul className="mt-5 space-y-2.5 border-t border-slate-100 pt-4 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <Store className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
                Ціни такі ж, як у магазинах GURMAN {IN_CITY}
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
                Заміна або повернення, якщо щось не так
              </li>
            </ul>
          </div>

          <Link
            to={ROUTES.catalog}
            className="mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-50"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Продовжити покупки
          </Link>
        </aside>
      </div>
    </>
  );
}
