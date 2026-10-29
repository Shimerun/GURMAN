import { FREE_DELIVERY_THRESHOLD } from '../../lib/constants';
import { getAmountToFreeDelivery } from '../../lib/delivery';
import { formatPrice } from '../../lib/format';

/** @param {{ subtotal: number, className?: string }} props */
export default function DeliveryProgress({ subtotal, className }) {
  const amountToFreeDelivery = getAmountToFreeDelivery(subtotal);

  return (
    <div className={className}>
      <p className="text-xs text-slate-600">
        {amountToFreeDelivery > 0 ? (
          <>
            До безкоштовної доставки ще <span className="font-semibold text-slate-900">{formatPrice(amountToFreeDelivery)}</span>
          </>
        ) : (
          <span className="font-semibold text-emerald-700">Доставка безкоштовна 🎉</span>
        )}
      </p>
      <progress
        className="progress progress-primary mt-1.5 h-1.5 w-full"
        value={Math.min(subtotal, FREE_DELIVERY_THRESHOLD)}
        max={FREE_DELIVERY_THRESHOLD}
        aria-label="Прогрес до безкоштовної доставки"
      />
    </div>
  );
}
