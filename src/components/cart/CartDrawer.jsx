import { Store, Tag, X } from 'lucide-react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { buttonClassName } from '../../lib/buttonStyles';
import { IN_CITY, PROMO_LISTING_QUERY } from '../../lib/constants';
import { PRODUCT_FORMS, pluralize } from '../../lib/format';
import { ROUTES, getCatalogPath } from '../../lib/routes';
import { selectTotalItems, selectTotalPrice, selectTotalSavings, useCartStore } from '../../store/useCartStore';
import BasketIllustration from '../ui/BasketIllustration';
import EmptyState from '../ui/EmptyState';
import CartItem from './CartItem';
import CartTotals from './CartTotals';
import PrintListButton from './PrintListButton';
import ShareListButton from './ShareListButton';

/** Links inside close the drawer implicitly: SiteLayout closes it on every route change. */
export default function CartDrawer() {
  const isOpen = useCartStore((state) => state.isCartOpen);
  const items = useCartStore((state) => state.items);
  const closeCart = useCartStore((state) => state.closeCart);
  const clearCart = useCartStore((state) => state.clearCart);
  const totalItems = useCartStore(selectTotalItems);
  const totalPrice = useCartStore(selectTotalPrice);
  const totalSavings = useCartStore(selectTotalSavings);
  const panelRef = useRef(null);

  useFocusTrap(panelRef, { isActive: isOpen, onEscape: closeCart });
  useBodyScrollLock(isOpen);

  if (!isOpen) return null;

  const isEmpty = items.length === 0;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 animate-fade-in bg-slate-900/50" onClick={closeCart} aria-hidden="true" />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        aria-describedby="cart-summary"
        tabIndex={-1}
        className="relative flex h-full w-screen animate-slide-in-right flex-col overflow-y-auto overscroll-contain bg-white shadow-2xl focus:outline-none sm:w-full sm:max-w-md"
      >
        <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-5 py-3 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div>
              <h2 id="cart-title" className="text-lg font-bold text-slate-900">
                Кошик
              </h2>
              <p id="cart-summary" className="text-sm text-slate-600">
                {pluralize(totalItems, PRODUCT_FORMS)}
              </p>
            </div>
            <button
              type="button"
              onClick={closeCart}
              aria-label="Закрити кошик"
              className="-mr-2 grid h-11 w-11 place-items-center rounded-full text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="flex-1 px-5">
          {isEmpty ? (
            <EmptyState
              className="mt-8 shadow-none ring-0"
              illustration={<BasketIllustration variant="empty" />}
              title="Кошик порожній"
              description="Почніть з акцій тижня або загляньте в каталог — кошик збережеться навіть після закриття сторінки."
              action={
                <div className="flex flex-wrap justify-center gap-2">
                  <Link to={getCatalogPath(PROMO_LISTING_QUERY)} className={buttonClassName({ variant: 'accent' })}>
                    <Tag className="h-4 w-4" aria-hidden="true" />
                    Акції тижня
                  </Link>
                  <Link to={ROUTES.catalog} className={buttonClassName({ variant: 'secondary' })}>
                    Каталог
                  </Link>
                </div>
              }
            />
          ) : (
            <ul className="cart-drawer-lines divide-y divide-slate-100">
              {items.map((item) => (
                <CartItem key={item.product.id} item={item} />
              ))}
            </ul>
          )}
        </div>

        {!isEmpty && (
          <div className="pb-safe sticky bottom-0 border-t border-slate-200 bg-white/95 px-5 pt-4 backdrop-blur-md">
            <CartTotals totalPrice={totalPrice} totalSavings={totalSavings} />
            <p className="mt-3 flex items-start gap-2 text-xs text-slate-600">
              <Store className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" aria-hidden="true" />
              Це ваш список покупок: надішліть його собі й купуйте в магазинах GURMAN {IN_CITY}.
            </p>
            <div className="mt-3 flex items-start gap-2">
              <ShareListButton className="min-w-0 flex-1" />
              <PrintListButton isIconOnly />
            </div>
            <div className="flex items-center justify-between gap-2 py-2">
              <Link to={ROUTES.cart} className={buttonClassName({ variant: 'ghost', size: 'sm' })}>
                Відкрити кошик
              </Link>
              <button
                type="button"
                onClick={clearCart}
                className="inline-flex h-11 items-center rounded-lg px-4 text-sm font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-700"
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
