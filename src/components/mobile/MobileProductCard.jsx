import { Plus } from 'lucide-react';
import { memo } from 'react';
import toast from 'react-hot-toast';
import { cn } from '../../lib/utils';
import { selectItemQuantity, useCartStore } from '../../store/useCartStore';
import { useUIStore } from '../../store/useUIStore';
import PriceTag from '../ui/PriceTag';
import QuantityStepper from '../ui/QuantityStepper';
import SafeImage from '../ui/SafeImage';
import StockBadge from '../ui/StockBadge';

/** @param {{ product: import('../../services/productService').Product, isImageEager?: boolean, className?: string }} props */
function MobileProductCard({ product, isImageEager = false, className }) {
  const quantity = useCartStore(selectItemQuantity(product.id));
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const openSheet = useUIStore((state) => state.openSheet);

  const isOutOfStock = product.stockStatus === 'out_of_stock' || product.stockQty <= 0;

  // "+" is only rendered while the product is not in the cart, so the toast fires once per first add.
  const handleAddToCart = () => {
    addItem(product);
    toast.success('Додано в кошик');
  };

  return (
    <article className={cn('relative flex h-full flex-col rounded-2xl bg-white p-2.5 shadow-soft ring-1 ring-slate-100', className)}>
      <div className="overflow-hidden rounded-xl bg-emerald-50">
        <SafeImage
          src={product.image}
          alt=""
          isEager={isImageEager}
          width={400}
          height={400}
          className={cn('aspect-square w-full object-cover', isOutOfStock && 'opacity-60 grayscale')}
        />
      </div>

      <StockBadge status={product.stockStatus} className="mt-2" />

      {/* Stretched button: its ::after covers the card, while the cart controls sit above it (z-10),
          so tapping the stepper never opens the product sheet. */}
      <h3 className="mt-1.5 text-left">
        <button
          type="button"
          onClick={() => openSheet('product', { productId: product.id })}
          className="line-clamp-2 min-h-[2.5rem] text-left text-sm font-medium leading-5 text-slate-800 after:absolute after:inset-0 after:rounded-2xl after:content-[''] active:after:bg-slate-900/5"
        >
          {product.title}
        </button>
      </h3>

      <div className="mt-auto pt-2">
        {quantity > 0 ? (
          <>
            <PriceTag product={product} size="sm" />
            <QuantityStepper
              size="lg"
              quantity={quantity}
              maxQuantity={product.stockQty}
              onChange={(nextQuantity) => updateQuantity(product.id, nextQuantity)}
              productTitle={product.title}
              className="relative z-10 mt-2"
            />
          </>
        ) : (
          <div className="flex items-end justify-between gap-1">
            <PriceTag product={product} size="sm" className="min-w-0" />
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              aria-label={isOutOfStock ? `«${product.title}» немає в наявності` : `Додати «${product.title}» у кошик`}
              className="relative z-10 grid min-h-11 min-w-11 shrink-0 place-items-center rounded-full bg-emerald-600 text-white shadow-sm active:scale-95 disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none"
            >
              <Plus className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

export default memo(MobileProductCard);
