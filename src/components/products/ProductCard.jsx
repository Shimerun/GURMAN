import { ShoppingCart } from 'lucide-react';
import { useLayoutEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useViewTransitionState } from 'react-router-dom';
import { FEATURES } from '../../config/business';
import { buttonClassName } from '../../lib/buttonStyles';
import { resetCardTilt, tiltCardTowardsPointer } from '../../lib/cardTilt';
import { flyToCart } from '../../lib/flyToCart';
import { IMAGE_SIZES } from '../../lib/imageSizes';
import { vibrateOnTap } from '../../lib/haptics';
import { loadProductPage } from '../../lib/pageLoaders';
import { isMorphSourceImage, rememberTappedCardImage } from '../../lib/productImageMorph';
import { getProductPath } from '../../lib/routes';
import { cn } from '../../lib/utils';
import { selectItemQuantity, useCartStore } from '../../store/useCartStore';
import PriceTag from '../ui/PriceTag';
import ProductBadges from '../ui/ProductBadges';
import QuantityStepper from '../ui/QuantityStepper';
import Rating from '../ui/Rating';
import SafeImage from '../ui/SafeImage';
import StockBadge from '../ui/StockBadge';
import FavoriteButton from './FavoriteButton';

/**
 * @param {{ product: import('../../services/productService').Product, isImageEager?: boolean, hasImageTransition?: boolean }} props
 * `hasImageTransition` lets the image morph into the product page's main image on navigation.
 */
export default function ProductCard({ product, isImageEager = false, hasImageTransition = true }) {
  const quantity = useCartStore(selectItemQuantity(product.id));
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  const isOutOfStock = product.stockStatus === 'out_of_stock' || product.stockQty <= 0;
  const productPath = getProductPath(product.id);
  const isImageMorphing = useViewTransitionState(productPath) && hasImageTransition;
  const imageRef = useRef(/** @type {HTMLDivElement | null} */ (null));

  // Every card of this product sees the transition; only one may carry the shared name (names must
  // be unique per page), so the choice is made against the DOM before the browser takes its snapshot.
  useLayoutEffect(() => {
    const image = imageRef.current;
    if (!isImageMorphing || !image || !isMorphSourceImage(image, product.id)) return undefined;
    image.dataset.morphSource = '';
    return () => {
      delete image.dataset.morphSource;
    };
  }, [isImageMorphing, product.id]);
  // Set only by this card's own controls, so cards already in the cart on page load don't animate.
  const [cartControlMotion, setCartControlMotion] = useState(/** @type {'expand' | 'collapse' | null} */ (null));

  // The add button is only rendered when the product isn't in the cart yet,
  // so this toast fires exactly once per first add.
  /** @param {import('react').MouseEvent<HTMLButtonElement>} event */
  const handleAddToCart = (event) => {
    flyToCart(event.currentTarget);
    vibrateOnTap();
    setCartControlMotion('expand');
    addItem(product);
    toast.success(`«${product.title}» у кошику`);
  };

  return (
    // Warming the product-page chunk on intent keeps the image morph from catching a loading fallback.
    <article
      onPointerEnter={loadProductPage}
      onPointerMove={tiltCardTowardsPointer}
      onPointerLeave={resetCardTilt}
      onTouchStart={loadProductPage}
      onFocus={loadProductPage}
      className="group relative flex h-full flex-col rounded-2xl bg-white p-3 shadow-soft ring-1 ring-slate-100 card-tilt transition-[transform,box-shadow] duration-200 hover:shadow-md focus-within:ring-2 focus-within:ring-emerald-600 motion-reduce:transition-none sm:p-4">
      {/* overflow-clip keeps the badge glint's scroll timeline on the page (hidden would make this box its scroller). */}
      <div ref={imageRef} data-morph-product={hasImageTransition ? product.id : undefined} className="relative overflow-clip rounded-xl bg-emerald-50">
        {/* pointer-events-none keeps the stretched product link clickable through the badges. */}
        {/* right-12 keeps the badges clear of the heart: a second badge wraps below instead of hiding under it. */}
        <ProductBadges product={product} className="pointer-events-none absolute left-2 right-12 top-2 z-[1]" />
        {/* z-10 lifts it above the stretched product link, like the cart controls. */}
        <FavoriteButton product={product} className="absolute right-0.5 top-0.5 z-10" />
        {product.stockStatus !== 'in_stock' && (
          <StockBadge status={product.stockStatus} className="pointer-events-none absolute bottom-2 left-2 z-[1] shadow-sm" />
        )}
        <SafeImage
          src={product.image}
          sizes={IMAGE_SIZES.productCard}
          alt=""
          isEager={isImageEager}
          width={400}
          height={400}
          className={cn(
            'aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100',
            isOutOfStock && 'opacity-60 grayscale',
          )}
        />
      </div>

      <div className="mt-3 flex flex-1 flex-col">
        <div className="flex items-center justify-between gap-2">
          <p className="min-w-0 truncate text-xs font-semibold text-emerald-800">{product.categoryTitle}</p>
          {FEATURES.productRatings && <Rating rating={product.rating} reviewsCount={product.reviewsCount} isCompact className="shrink-0" />}
        </div>

        {/* Stretched link: its ::after covers the card, while the cart controls sit above it (z-10). */}
        <h3 className="mt-1.5">
          <Link
            to={productPath}
            viewTransition={hasImageTransition}
            onClick={() => rememberTappedCardImage(imageRef.current)}
            className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-5 text-slate-800 transition-colors after:absolute after:inset-0 after:rounded-2xl after:content-[''] focus:outline-none group-hover:text-emerald-800"
          >
            {product.title}
          </Link>
        </h3>

        <div className="mt-auto pt-3">
          <PriceTag product={product} />

          <div className="relative z-10 mt-3">
            {quantity > 0 ? (
              <QuantityStepper
                quantity={quantity}
                maxQuantity={product.stockQty}
                onChange={(nextQuantity) => {
                  if (nextQuantity === 0) setCartControlMotion('collapse');
                  updateQuantity(product.id, nextQuantity);
                }}
                productTitle={product.title}
                unit={product.unit}
                className={cartControlMotion === 'expand' ? 'cart-control-expand' : undefined}
              />
            ) : (
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={buttonClassName({ size: 'sm', className: cn('w-full', cartControlMotion === 'collapse' && 'cart-control-collapse') })}
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
