import { ArrowRight, ShoppingBasket, X } from 'lucide-react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useCheckoutNotice } from '../../hooks/useCheckoutNotice';
import { buttonClassName } from '../../lib/buttonStyles';
import { PRODUCT_FORMS, pluralize } from '../../lib/format';
import { ROUTES } from '../../lib/routes';
import { selectTotalItems, selectTotalPrice, selectTotalSavings, useCartStore } from '../../store/useCartStore';
import EmptyState from '../ui/EmptyState';
import CartItem from './CartItem';
import CartTotals from './CartTotals';

/** Links inside close the drawer implicitly: SiteLayout closes it on every route change. */
export default function CartDrawer() {
  const isOpen = useCartStore((state) => state.isCartOpen);
  const items = useCartStore((state) => state.items);
  const closeCart = useCartStore((state) => state.closeCart);
  const clearCart = useCartStore((state) => state.clearCart);
  const totalItems = useCartStore(selectTotalItems);
  const totalPrice = useCartStore(selectTotalPrice);
  const totalSavings = useCartStore(selectTotalSavings);
  const showCheckoutNotice = useCheckoutNotice();
  const panelRef = useRef(null);

  useFocusTrap(panelRef, { isActive: isOpen, onEscape: closeCart });
  useBodyScrollLock(isOpen);

  if (!isOpen) return null;

  const isEmpty = items.length === 0;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 animate-fade-in bg-slate-900/40" onClick={closeCart} aria-hidden="true" />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        tabIndex={-1}
        className="relative flex h-full w-screen animate-slide-in-right flex-col overflow-y-auto overscroll-contain bg-white shadow-2xl focus:outline-none sm:w-full sm:max-w-md"
      >
        <div className="sticky top-0 z-10 border-b border-slate-200/70 bg-white/80 px-5 py-4 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div>
              <h2 id="cart-title" className="text-lg font-bold text-slate-900">
                Кошик
              </h2>
              <p className="text-xs text-slate-500">{pluralize(totalItems, PRODUCT_FORMS)}</p>
            </div>
            <button
              type="button"
              onClick={closeCart}
              aria-label="Закрити кошик"
              className="grid h-10 w-10 place-items-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="flex-1 px-5">
          {isEmpty ? (
            <EmptyState
              className="mt-8 shadow-none ring-0"
              icon={ShoppingBasket}
              title="Кошик порожній"
              description="Додайте товари з каталогу або з акцій тижня."
              action={
                <Link to={ROUTES.catalog} className={buttonClassName()}>
                  Перейти до каталогу
                </Link>
              }
            />
          ) : (
            <ul className="divide-y divide-slate-100">
              {items.map((item) => (
                <CartItem key={item.product.id} item={item} />
              ))}
            </ul>
          )}
        </div>

        {!isEmpty && (
          <div className="sticky bottom-0 border-t border-slate-200/70 bg-white/90 px-5 py-4 backdrop-blur-md">
            <CartTotals totalPrice={totalPrice} totalSavings={totalSavings} />
            <button type="button" onClick={showCheckoutNotice} className={buttonClassName({ size: 'lg', className: 'mt-4 w-full' })}>
              Оформити замовлення
            </button>
            <div className="mt-2 flex items-center justify-between gap-2">
              <Link
                to={ROUTES.cart}
                className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-50"
              >
                Відкрити кошик
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <button
                type="button"
                onClick={clearCart}
                className="rounded-full px-3 py-2 text-sm font-medium text-slate-500 transition-colors hover:text-red-600"
              >
                Очистити кошик
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
