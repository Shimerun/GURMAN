import { CircleCheck, Info, MapPin } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { buttonClassName } from '../../lib/buttonStyles';
import { IN_CITY } from '../../lib/constants';
import { PRODUCT_FORMS, formatPrice, pluralize } from '../../lib/format';
import { ROUTES } from '../../lib/routes';
import { selectTotalItems, selectTotalPrice, useCartStore } from '../../store/useCartStore';
import BasketIllustration from '../ui/BasketIllustration';
import Modal from '../ui/Modal';

/**
 * Demo checkout: there is no order backend and no delivery, so the dialog says so before the
 * user confirms. Confirming only clears the cart; nothing is sent or charged.
 * @param {{ onClose: () => void }} props
 */
export default function CheckoutDialog({ onClose }) {
  const totalItems = useCartStore(selectTotalItems);
  const totalPrice = useCartStore(selectTotalPrice);
  const clearCart = useCartStore((state) => state.clearCart);
  // Snapshot so the confirmation can still show what was "ordered" after the cart is cleared.
  const [confirmedOrder, setConfirmedOrder] = useState(/** @type {{ totalItems: number, totalPrice: number } | null} */ (null));

  const handleConfirm = () => {
    setConfirmedOrder({ totalItems, totalPrice });
    clearCart();
  };

  if (confirmedOrder) {
    return (
      <Modal
        key="confirmed"
        title="Демо-замовлення оформлено"
        description="Кошик очищено. Це демонстрація: замовлення не передано в магазин і кошти не списано."
        onClose={onClose}
        footer={
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Link to={ROUTES.contacts} className={buttonClassName({ variant: 'secondary' })}>
              <MapPin className="h-4 w-4" aria-hidden="true" />
              Адреси магазинів
            </Link>
            <Link to={ROUTES.catalog} className={buttonClassName()}>
              Продовжити покупки
            </Link>
          </div>
        }
      >
        <BasketIllustration variant="filled" className="mb-4" />
        <p role="status" className="flex items-start gap-3 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-900 ring-1 ring-emerald-100">
          <CircleCheck className="h-6 w-6 shrink-0 text-emerald-700" aria-hidden="true" />
          <span>
            <span className="block font-semibold">
              {pluralize(confirmedOrder.totalItems, PRODUCT_FORMS)} на суму {formatPrice(confirmedOrder.totalPrice)}
            </span>
            Ці товари можна купити в будь-якому магазині GURMAN {IN_CITY} за тими самими цінами.
          </span>
        </p>
      </Modal>
    );
  }

  return (
    <Modal
      key="confirm"
      title="Оформлення демо-замовлення"
      description="Це демонстраційний сайт: замовлення не передається в магазин, оплата не списується."
      onClose={onClose}
      footer={
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className={buttonClassName({ variant: 'secondary' })}>
            Повернутися до кошика
          </button>
          <button type="button" onClick={handleConfirm} className={buttonClassName()}>
            Підтвердити демо-замовлення
          </button>
        </div>
      }
    >
      <dl className="space-y-2 rounded-2xl bg-slate-50 p-4 text-sm ring-1 ring-slate-100">
        <div className="flex justify-between gap-3 text-slate-700">
          <dt>Товари</dt>
          <dd>{pluralize(totalItems, PRODUCT_FORMS)}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-3 text-slate-900">
          <dt className="font-semibold">Разом</dt>
          <dd className="text-xl font-extrabold tabular-nums">{formatPrice(totalPrice)}</dd>
        </div>
      </dl>
      <p className="mt-4 flex items-start gap-2 text-sm text-slate-700">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" aria-hidden="true" />
        Після підтвердження кошик очиститься. Купити товари можна в будь-якому з двох магазинів GURMAN {IN_CITY}.
      </p>
    </Modal>
  );
}
