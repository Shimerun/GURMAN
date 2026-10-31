import { ArrowRight, CircleCheck, PackageX, Phone } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { buttonClassName } from '../../lib/buttonStyles';
import { STORE_CONTACTS } from '../../lib/constants';
import { flyToCart } from '../../lib/flyToCart';
import { vibrateOnTap } from '../../lib/haptics';
import { formatPrice } from '../../lib/format';
import { ROUTES, getCategoryPath } from '../../lib/routes';
import { selectItemQuantity, useCartStore } from '../../store/useCartStore';
import BrandIcon from '../ui/BrandIcon';
import QuantityStepper from '../ui/QuantityStepper';

/** @typedef {import('../../services/productService').Product} Product */

/**
 * True while `element` is fully on screen; starts true so nothing flashes before the first
 * observation. Full visibility matters: a panel whose top edge peeks in still hides its button.
 * @param {Element | null} element
 */
function useIsFullyOnScreen(element) {
  const [isOnScreen, setIsOnScreen] = useState(true);

  useEffect(() => {
    if (!element) return undefined;
    const observer = new IntersectionObserver(([entry]) => setIsOnScreen(entry.intersectionRatio >= 0.99), { threshold: [0, 0.99] });
    observer.observe(element);
    return () => observer.disconnect();
  }, [element]);

  return isOnScreen;
}

/** @param {{ product: Product }} props */
function OutOfStockNotice({ product }) {
  return (
    <div className="rounded-lg bg-white p-5 shadow-soft ring-1 ring-red-100">
      <p className="flex items-center gap-2 text-base font-bold text-slate-900">
        <PackageX className="h-5 w-5 text-red-700" aria-hidden="true" />
        Зараз немає в наявності
      </p>
      <p className="mt-1.5 text-sm text-slate-700">
        Чекаємо на нову поставку. Наявність у конкретному магазині підкажуть за телефоном {STORE_CONTACTS.phone}.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link to={getCategoryPath(product.category)} className={buttonClassName({ size: 'sm' })}>
          Схожі товари
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
        <a href={STORE_CONTACTS.phoneHref} className={buttonClassName({ variant: 'secondary', size: 'sm' })}>
          <Phone className="h-4 w-4" aria-hidden="true" />
          Уточнити наявність
        </a>
      </div>
    </div>
  );
}

/**
 * Quantity picker + "add to cart" for the product page. The picker selects how many to add
 * (min 1); the cart store still caps the line at `stockQty`. On phones a compact bar keeps the
 * action reachable while the panel itself is scrolled out of view.
 * @param {{ product: Product }} props
 */
export default function ProductPurchasePanel({ product }) {
  const quantityInCart = useCartStore(selectItemQuantity(product.id));
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [lastAddedQuantity, setLastAddedQuantity] = useState(/** @type {number | null} */ (null));
  // Callback ref: the observed element changes when the button gives way to the "all in cart" note.
  const [primaryActionElement, setPrimaryActionElement] = useState(/** @type {Element | null} */ (null));
  const isPanelOnScreen = useIsFullyOnScreen(primaryActionElement);

  const isOutOfStock = product.stockStatus === 'out_of_stock' || product.stockQty <= 0;
  const availableToAdd = Math.max(product.stockQty - quantityInCart, 0);
  const quantityToAdd = Math.min(selectedQuantity, Math.max(availableToAdd, 1));
  const canAdd = !isOutOfStock && availableToAdd > 0;

  /** @param {import('react').MouseEvent<HTMLButtonElement>} event */
  const handleAddToCart = (event) => {
    if (!canAdd) return;

    flyToCart(event.currentTarget);
    vibrateOnTap();
    if (quantityInCart === 0) {
      addItem(product);
      if (quantityToAdd > 1) updateQuantity(product.id, quantityToAdd);
    } else {
      updateQuantity(product.id, quantityInCart + quantityToAdd);
    }
    setLastAddedQuantity(quantityToAdd);
    setSelectedQuantity(1);
    // The inline confirmation is only seen (and announced) when the panel is on screen.
    if (!isPanelOnScreen) toast.success(`Додано в кошик: ${quantityToAdd} ${product.unit}`);
  };

  if (isOutOfStock) return <OutOfStockNotice product={product} />;

  return (
    <>
      <div className="border-t border-slate-200 pt-5">
        {canAdd ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-sm font-semibold text-slate-800">
                Кількість, {product.unit}
                <span className="block text-xs font-normal text-slate-600">Доступно для кошика: {availableToAdd}</span>
              </span>
              <QuantityStepper
                size="lg"
                minQuantity={1}
                quantity={quantityToAdd}
                maxQuantity={availableToAdd}
                onChange={setSelectedQuantity}
                productTitle={product.title}
                unit={product.unit}
                className="w-40"
              />
            </div>
            <button ref={setPrimaryActionElement} type="button" onClick={handleAddToCart} className={buttonClassName({ size: 'lg', className: 'mt-4 w-full' })}>
              <BrandIcon name="basket" className="h-5 w-5" />
              Додати в кошик · {formatPrice(product.price * quantityToAdd)}
            </button>
          </>
        ) : (
          <p ref={setPrimaryActionElement} className="rounded-lg bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900">
            У кошику вся доступна кількість цього товару ({product.stockQty} {product.unit}).
          </p>
        )}

        <div role="status" aria-live="polite">
          {quantityInCart > 0 && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-emerald-50 px-4 py-3 ring-1 ring-emerald-100">
              <p className="flex items-center gap-2 text-sm text-emerald-900">
                <CircleCheck className="h-5 w-5 shrink-0 text-emerald-700" aria-hidden="true" />
                <span>
                  {lastAddedQuantity !== null && (
                    <span className="font-semibold">
                      Додано {lastAddedQuantity} {product.unit}.{' '}
                    </span>
                  )}
                  У кошику: {quantityInCart} {product.unit}
                </span>
              </p>
              <Link to={ROUTES.cart} className={buttonClassName({ variant: 'ghost', size: 'sm', className: '-my-1' })}>
                До кошика
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          )}
        </div>
      </div>

      {!isPanelOnScreen && (
        <div className="fixed inset-x-0 bottom-[calc(3.5rem+env(safe-area-inset-bottom))] z-30 border-t border-slate-200 bg-white/95 px-4 py-2 shadow-[0_-4px_16px_-8px_rgb(15_23_42/0.15)] backdrop-blur-md md:hidden">
          <div className="flex items-center gap-3">
            <p className="min-w-0 flex-1">
              <span className="block truncate text-xs text-slate-600">{product.title}</span>
              <span className="font-extrabold tabular-nums text-slate-900">
                {formatPrice(product.price)} <span className="text-xs font-normal text-slate-600">/ {product.unit}</span>
              </span>
            </p>
            {canAdd ? (
              <button type="button" onClick={handleAddToCart} className={buttonClassName({ size: 'sm', className: 'shrink-0' })}>
                <BrandIcon name="basket" className="h-4 w-4" />
                У кошик
              </button>
            ) : (
              <Link to={ROUTES.cart} className={buttonClassName({ variant: 'secondary', size: 'sm', className: 'shrink-0' })}>
                До кошика
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
