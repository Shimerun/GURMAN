import { ShoppingBasket } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useProduct } from '../../../hooks/useProducts';
import { formatPrice } from '../../../lib/format';
import { cn } from '../../../lib/utils';
import { selectItemQuantity, useCartStore } from '../../../store/useCartStore';
import { useUIStore } from '../../../store/useUIStore';
import ErrorState from '../../ui/ErrorState';
import PriceTag from '../../ui/PriceTag';
import QuantityStepper from '../../ui/QuantityStepper';
import SafeImage from '../../ui/SafeImage';
import StockBadge from '../../ui/StockBadge';
import BottomSheet from '../BottomSheet';

function ProductSheetSkeleton() {
  return (
    <div aria-busy="true" aria-label="Завантаження товару">
      <div className="skeleton aspect-[4/3] w-full rounded-2xl" />
      <div className="skeleton mt-4 h-5 w-24 rounded-full" />
      <div className="skeleton mt-4 h-9 w-40 rounded" />
      <div className="skeleton mt-6 h-12 w-36 rounded-full" />
    </div>
  );
}

/** @param {{ productId: string }} props */
export default function ProductSheet({ productId }) {
  const closeSheet = useUIStore((state) => state.closeSheet);
  const { data: product, isLoading, error, refetch } = useProduct(productId);
  const quantityInCart = useCartStore(selectItemQuantity(productId));
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const isOutOfStock = !product || product.stockStatus === 'out_of_stock' || product.stockQty <= 0;
  const availableToAdd = product ? Math.max(product.stockQty - quantityInCart, 0) : 0;
  const quantityToAdd = Math.min(selectedQuantity, Math.max(availableToAdd, 1));
  const canAdd = !isOutOfStock && availableToAdd > 0;

  const handleAddToCart = () => {
    if (!product || !canAdd) return;

    if (quantityInCart === 0) {
      addItem(product);
      if (quantityToAdd > 1) updateQuantity(product.id, quantityToAdd);
      toast.success('Додано в кошик');
    } else {
      // Existing line: quantity change only, no "added" toast (store caps at stockQty).
      updateQuantity(product.id, quantityInCart + quantityToAdd);
    }
    closeSheet();
  };

  const ctaLabel = isOutOfStock
    ? 'Немає в наявності'
    : canAdd
      ? `Додати в кошик · ${formatPrice(product.price * quantityToAdd)}`
      : 'У кошику вся доступна кількість';

  return (
    <BottomSheet
      title={product?.title ?? 'Товар'}
      onClose={closeSheet}
      footer={
        product && (
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!canAdd}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 text-base font-semibold text-white shadow-sm active:scale-95 disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none"
          >
            <ShoppingBasket className="h-5 w-5" aria-hidden="true" />
            {ctaLabel}
          </button>
        )
      }
    >
      {isLoading && <ProductSheetSkeleton />}

      {error && !isLoading && <ErrorState title="Не вдалося завантажити товар" onRetry={refetch} buttonClassName="min-h-11 active:scale-95" />}

      {product && !error && (
        <div>
          <div className="overflow-hidden rounded-2xl bg-emerald-50">
            <SafeImage
              src={product.image}
              alt={product.title}
              isEager
              width={400}
              height={300}
              className={cn('aspect-[4/3] w-full object-cover', isOutOfStock && 'opacity-60 grayscale')}
            />
          </div>

          <StockBadge status={product.stockStatus} className="mt-4" />
          <PriceTag product={product} size="lg" className="mt-3" />
          {product.stockStatus === 'low_stock' && (
            <p className="mt-2 text-sm text-amber-700">
              Залишилось лише {product.stockQty} {product.unit}
            </p>
          )}

          {canAdd && (
            <div className="mt-6 flex items-center justify-between gap-4">
              <span className="text-sm text-slate-600">Кількість, {product.unit}</span>
              <QuantityStepper
                size="lg"
                minQuantity={1}
                quantity={quantityToAdd}
                maxQuantity={availableToAdd}
                onChange={setSelectedQuantity}
                productTitle={product.title}
              />
            </div>
          )}

          {quantityInCart > 0 && (
            <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              У кошику вже {quantityInCart} {product.unit}
            </p>
          )}
        </div>
      )}
    </BottomSheet>
  );
}
