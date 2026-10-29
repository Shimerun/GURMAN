import { ShoppingBasket, X } from 'lucide-react';
import { useRef } from 'react';
import toast from 'react-hot-toast';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { SECTION_IDS } from '../../lib/constants';
import { getDeliveryFee } from '../../lib/delivery';
import { PRODUCT_FORMS, formatPrice, pluralize } from '../../lib/format';
import { scrollToSection } from '../../lib/utils';
import { selectTotalItems, selectTotalPrice, useCartStore } from '../../store/useCartStore';
import DeliveryProgress from '../ui/DeliveryProgress';
import EmptyState from '../ui/EmptyState';
import CartItem from './CartItem';

export default function CartDrawer() {
  const isOpen = useCartStore((state) => state.isCartOpen);
  const items = useCartStore((state) => state.items);
  const closeCart = useCartStore((state) => state.closeCart);
  const clearCart = useCartStore((state) => state.clearCart);
  const totalItems = useCartStore(selectTotalItems);
  const totalPrice = useCartStore(selectTotalPrice);
  const panelRef = useRef(null);

  useFocusTrap(panelRef, { isActive: isOpen, onEscape: closeCart });
  useBodyScrollLock(isOpen);

  if (!isOpen) return null;

  const isEmpty = items.length === 0;
  const deliveryFee = getDeliveryFee(totalPrice);

  const handleCheckout = () => {
    toast.success('Замовлення прийнято!');
    clearCart();
    closeCart();
  };

  const handleBrowseCatalog = () => {
    closeCart();
    scrollToSection(SECTION_IDS.catalog);
  };

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

          {!isEmpty && <DeliveryProgress subtotal={totalPrice} className="mt-3" />}
        </div>

        <div className="flex-1 px-5">
          {isEmpty ? (
            <EmptyState
              className="mt-8 shadow-none ring-0"
              icon={ShoppingBasket}
              title="Кошик порожній"
              description="Додайте товари з каталогу або з акцій тижня."
              action={
                <button
                  type="button"
                  onClick={handleBrowseCatalog}
                  className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
                >
                  Перейти до каталогу
                </button>
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
            <dl className="space-y-1.5 text-sm">
              <div className="flex justify-between text-slate-600">
                <dt>Товари</dt>
                <dd className="tabular-nums">{formatPrice(totalPrice)}</dd>
              </div>
              <div className="flex justify-between text-slate-600">
                <dt>Доставка</dt>
                <dd className="tabular-nums">{deliveryFee > 0 ? formatPrice(deliveryFee) : 'Безкоштовно'}</dd>
              </div>
              <div className="flex justify-between pt-1 text-base font-bold text-slate-900">
                <dt>Разом</dt>
                <dd className="tabular-nums">{formatPrice(totalPrice + deliveryFee)}</dd>
              </div>
            </dl>
            <button
              type="button"
              onClick={handleCheckout}
              className="mt-4 h-12 w-full rounded-full bg-emerald-600 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
            >
              Оформити замовлення
            </button>
            <button
              type="button"
              onClick={clearCart}
              className="mt-2 w-full rounded-full py-2 text-sm font-medium text-slate-500 transition-colors hover:text-red-600"
            >
              Очистити кошик
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
