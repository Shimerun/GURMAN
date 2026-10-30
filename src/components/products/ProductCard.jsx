import { ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { buttonClassName } from '../../lib/buttonStyles';
import { getProductPath } from '../../lib/routes';
import { cn } from '../../lib/utils';
import { selectItemQuantity, useCartStore } from '../../store/useCartStore';
import PriceTag from '../ui/PriceTag';
import ProductBadges from '../ui/ProductBadges';
import QuantityStepper from '../ui/QuantityStepper';
import Rating from '../ui/Rating';
import SafeImage from '../ui/SafeImage';
import StockBadge from '../ui/StockBadge';

/** @param {{ product: import('../../services/productService').Product, isImageEager?: boolean }} props */
export default function ProductCard({ product, isImageEager = false }) {
  const quantity = useCartStore(selectItemQuantity(product.id));
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  const isOutOfStock = product.stockStatus === 'out_of_stock' || product.stockQty <= 0;
  const productPath = getProductPath(product.id);

  // The add button is only rendered when the product isn't in the cart yet,
  // so this toast fires exactly once per first add.
  const handleAddToCart = () => {
    addItem(product);
    toast.success('Додано в кошик');
  };

  return (
    <article className="group relative flex h-full flex-col rounded-2xl bg-white p-3 shadow-soft ring-1 ring-slate-100 transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-lg focus-within:ring-emerald-300 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-4">
      <div className="relative overflow-hidden rounded-xl bg-emerald-50">
        {/* pointer-events-none keeps the stretched product link clickable through the badges. */}
        <ProductBadges badges={product.badges} className="pointer-events-none absolute left-2 top-2 z-[1]" />
        <SafeImage
          src={product.image}
          alt=""
          isEager={isImageEager}
          width={400}
          height={400}
          className={cn(
            'aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100',
            isOutOfStock && 'opacity-60 grayscale',
          )}
        />
      </div>

      <div className="mt-3 flex flex-1 flex-col">
        <div className="flex items-center justify-between gap-2">
          <p className="min-w-0 truncate text-xs font-medium text-emerald-700">{product.categoryTitle}</p>
          <Rating rating={product.rating} reviewsCount={product.reviewsCount} isCompact className="shrink-0" />
        </div>

        {/* Stretched link: its ::after covers the card, while the cart controls sit above it (z-10). */}
        <h3 className="mt-1.5">
          <Link
            to={productPath}
            className="line-clamp-2 min-h-[2.5rem] text-sm font-medium leading-5 text-slate-800 transition-colors after:absolute after:inset-0 after:rounded-2xl after:content-[''] group-hover:text-emerald-700"
          >
            {product.title}
          </Link>
        </h3>

        <StockBadge status={product.stockStatus} className="mt-2" />

        <div className="mt-auto pt-3">
          <PriceTag product={product} />

          <div className="relative z-10 mt-3">
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
                className={buttonClassName({ size: 'sm', className: 'w-full' })}
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
