import { ShoppingBasket } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { buttonClassName } from '../../lib/buttonStyles';
import { formatPrice } from '../../lib/format';
import { selectItemQuantity, useCartStore } from '../../store/useCartStore';
import QuantityStepper from '../ui/QuantityStepper';

/**
 * Quantity picker + "add to cart" for the product page. The picker selects how many to add
 * (min 1); the cart store still caps the line at `stockQty`.
 * @param {{ product: import('../../services/productService').Product }} props
 */
export default function ProductPurchasePanel({ product }) {
  const quantityInCart = useCartStore(selectItemQuantity(product.id));
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const openCart = useCartStore((state) => state.openCart);
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const isOutOfStock = product.stockStatus === 'out_of_stock' || product.stockQty <= 0;
  const availableToAdd = Math.max(product.stockQty - quantityInCart, 0);
  const quantityToAdd = Math.min(selectedQuantity, Math.max(availableToAdd, 1));
  const canAdd = !isOutOfStock && availableToAdd > 0;

  const handleAddToCart = () => {
    if (!canAdd) return;

    if (quantityInCart === 0) {
      addItem(product);
      if (quantityToAdd > 1) updateQuantity(product.id, quantityToAdd);
    } else {
      updateQuantity(product.id, quantityInCart + quantityToAdd);
    }
    toast.success(`Додано в кошик: ${quantityToAdd} ${product.unit}`);
    setSelectedQuantity(1);
  };

  const ctaLabel = isOutOfStock
    ? 'Немає в наявності'
    : canAdd
      ? `Додати в кошик · ${formatPrice(product.price * quantityToAdd)}`
      : 'У кошику вся доступна кількість';

  return (
    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100 sm:p-5">
      {canAdd && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-sm font-medium text-slate-700">Кількість, {product.unit}</span>
          <QuantityStepper
            size="lg"
            minQuantity={1}
            quantity={quantityToAdd}
            maxQuantity={availableToAdd}
            onChange={setSelectedQuantity}
            productTitle={product.title}
            className="w-40"
          />
        </div>
      )}

      <button type="button" onClick={handleAddToCart} disabled={!canAdd} className={buttonClassName({ size: 'lg', className: 'mt-4 w-full' })}>
        <ShoppingBasket className="h-5 w-5" aria-hidden="true" />
        {ctaLabel}
      </button>

      {product.stockStatus === 'low_stock' && !isOutOfStock && (
        <p className="mt-3 text-sm text-amber-700">
          Поспішайте: залишилось лише {product.stockQty} {product.unit}
        </p>
      )}

      {quantityInCart > 0 && (
        <p className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          У кошику вже {quantityInCart} {product.unit}
          <button type="button" onClick={openCart} className="font-semibold underline-offset-2 hover:underline">
            Переглянути кошик
          </button>
        </p>
      )}
    </div>
  );
}
