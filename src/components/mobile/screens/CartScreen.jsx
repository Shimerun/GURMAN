import { ShoppingBasket } from 'lucide-react';
import toast from 'react-hot-toast';
import { getDeliveryFee } from '../../../lib/delivery';
import { PRODUCT_FORMS, formatPrice, pluralize } from '../../../lib/format';
import { selectTotalItems, selectTotalPrice, useCartStore } from '../../../store/useCartStore';
import { useUIStore } from '../../../store/useUIStore';
import DeliveryProgress from '../../ui/DeliveryProgress';
import EmptyState from '../../ui/EmptyState';
import MobileCartItem from '../MobileCartItem';

export default function CartScreen() {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const totalItems = useCartStore(selectTotalItems);
  const totalPrice = useCartStore(selectTotalPrice);
  const setTab = useUIStore((state) => state.setTab);

  if (items.length === 0) {
    return (
      <div className="px-4 pt-4">
        <h1 className="mb-4 text-2xl font-bold tracking-tight text-slate-900">Кошик</h1>
        <EmptyState
          icon={ShoppingBasket}
          title="Кошик порожній"
          description="Додайте товари з каталогу або з акцій тижня."
          action={
            <button
              type="button"
              onClick={() => setTab('catalog')}
              className="min-h-11 rounded-full bg-emerald-600 px-6 text-sm font-semibold text-white active:scale-95"
            >
              До каталогу
            </button>
          }
        />
      </div>
    );
  }

  const deliveryFee = getDeliveryFee(totalPrice);

  // Mock checkout: no network request.
  const handleCheckout = () => {
    toast.success('Замовлення прийнято!');
    clearCart();
    setTab('home');
  };

  return (
    <div className="px-4 pb-28 pt-4">
      <div className="mb-3 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Кошик</h1>
          <p className="text-sm text-slate-500">{pluralize(totalItems, PRODUCT_FORMS)}</p>
        </div>
        <button type="button" onClick={clearCart} className="min-h-11 rounded-full px-3 text-sm font-medium text-slate-500 active:text-red-600">
          Очистити
        </button>
      </div>

      <DeliveryProgress subtotal={totalPrice} className="mb-4 rounded-2xl bg-white p-3 shadow-soft ring-1 ring-slate-100" />

      <p className="mb-2 text-xs text-slate-400">Проведіть товар вліво, щоб видалити</p>
      <ul className="space-y-2">
        {items.map((item) => (
          <MobileCartItem key={item.product.id} item={item} />
        ))}
      </ul>

      <div className="fixed inset-x-0 bottom-[calc(3.5rem+env(safe-area-inset-bottom))] z-30 border-t border-slate-200/70 bg-white/80 px-4 py-3 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-slate-500">
              Разом{deliveryFee > 0 ? ` · доставка ${formatPrice(deliveryFee)}` : ' · доставка безкоштовна'}
            </p>
            <p className="text-xl font-bold tabular-nums text-slate-900">{formatPrice(totalPrice + deliveryFee)}</p>
          </div>
          <button
            type="button"
            onClick={handleCheckout}
            className="min-h-12 shrink-0 rounded-full bg-emerald-600 px-6 text-sm font-semibold text-white shadow-sm active:scale-95"
          >
            Оформити замовлення
          </button>
        </div>
      </div>
    </div>
  );
}
