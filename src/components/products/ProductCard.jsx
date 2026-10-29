import { ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '../../lib/utils';
import { selectItemQuantity, useCartStore } from '../../store/useCartStore';
import PriceTag from '../ui/PriceTag';
import QuantityStepper from '../ui/QuantityStepper';
import SafeImage from '../ui/SafeImage';
import StockBadge from '../ui/StockBadge';

/** @param {{ product: import('../../services/productService').Product, isImageEager?: boolean }} props */
export default function ProductCard({ product, isImageEager = false }) {
  const quantity = useCartStore(selectItemQuantity(product.id));
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  const isOutOfStock = product.stockStatus === 'out_of_stock' || product.stockQty <= 0;

  // The add button is only rendered when the product isn't in the cart yet,
  // so this toast fires exactly once per first add.
  const handleAddToCart = () => {
    addItem(product);
    toast.success('Додано в кошик');
  };

  return (
    <article className="group flex h-full flex-col rounded-2xl bg-white p-3 shadow-soft ring-1 ring-slate-100 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-4">
      <div className="overflow-hidden rounded-xl bg-emerald-50">
        <SafeImage
          src={product.image}
          alt={product.title}
          isEager={isImageEager}
          width={400}
          height={400}
          className={cn('aspect-square w-full object-cover', isOutOfStock && 'opacity-60 grayscale')}
        />
      </div>

      <div className="mt-3 flex flex-1 flex-col">
        <StockBadge status={product.stockStatus} />
        <h3 className="mt-2 line-clamp-2 min-h-[2.5rem] text-sm font-medium leading-5 text-slate-800">{product.title}</h3>

        <div className="mt-auto pt-3">
          <PriceTag product={product} />

          <div className="mt-3">
            {quantity > 0 ? (
              <QuantityStepper
                quantity={quantity}
                maxQuantity={product.stockQty}
                onChange={(nextQuantity) => updateQuantity(product.id, nextQuantity)}
                productTitle={product.title}
              />
            ) : (
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="flex h-10 w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
              >
                <ShoppingCart className="h-4 w-4" aria-hidden="true" />
                {isOutOfStock ? 'Немає' : 'У кошик'}
                <span className="sr-only">: {product.title}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
