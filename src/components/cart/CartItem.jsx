import { Trash2 } from 'lucide-react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { showRemovedFromCartToast } from '../../lib/cartToasts';
import { formatPrice } from '../../lib/format';
import { getProductPath } from '../../lib/routes';
import { useCartStore } from '../../store/useCartStore';
import QuantityStepper from '../ui/QuantityStepper';
import SafeImage from '../ui/SafeImage';

/** @param {{ item: import('../../store/useCartStore').CartItem }} props */
export default function CartItem({ item }) {
  const { product, quantity } = item;
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const addItem = useCartStore((state) => state.addItem);
  const itemRef = useRef(/** @type {HTMLLIElement | null} */ (null));
  const isRemovingRef = useRef(false);
  const isAtStockLimit = quantity >= product.stockQty;
  const productPath = getProductPath(product.id);

  // Collapses the row first so the list closes the gap smoothly, then removes it and offers undo.
  const handleRemove = () => {
    // A second tap while the row collapses must not remove it (and toast) twice.
    if (isRemovingRef.current) return;
    isRemovingRef.current = true;

    const removeWithUndo = () => {
      removeItem(product.id);
      showRemovedFromCartToast(product.title, () => {
        addItem(product);
        if (quantity > 1) updateQuantity(product.id, quantity);
      });
    };

    const row = itemRef.current;
    if (!row || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      removeWithUndo();
      return;
    }

    row.style.overflow = 'hidden';
    const shrinkRow = row.animate(
      [
        { height: `${row.offsetHeight}px`, opacity: 1 },
        { height: '0px', opacity: 0, paddingTop: '0px', paddingBottom: '0px' },
      ],
      { duration: 220, easing: 'ease-in', fill: 'forwards' },
    );
    shrinkRow.onfinish = removeWithUndo;
  };

  return (
    <li ref={itemRef} className="flex gap-3 py-4">
      <Link to={productPath} tabIndex={-1} aria-hidden="true" className="shrink-0">
        <SafeImage src={product.image} alt="" width={80} height={80} className="h-20 w-20 rounded-xl bg-emerald-50 object-cover transition-opacity hover:opacity-90" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-1">
          <h3 className="line-clamp-2 pt-0.5 text-sm font-semibold leading-5 text-slate-800">
            <Link to={productPath} className="transition-colors hover:text-emerald-800 hover:underline">
              {product.title}
            </Link>
          </h3>
          <button
            type="button"
            onClick={handleRemove}
            aria-label={`Видалити «${product.title}» з кошика`}
            className="-mr-2 -mt-2 grid h-11 w-11 shrink-0 place-items-center rounded-full text-slate-500 transition-colors hover:bg-red-50 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <p className="text-xs text-slate-600">
          {formatPrice(product.price)} / {product.unit}
        </p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-2 pt-2">
          <QuantityStepper
            // Removal is the trash button's job, so minus stops at 1 instead of silently dropping the line.
            minQuantity={1}
            quantity={quantity}
            maxQuantity={product.stockQty}
            onChange={(nextQuantity) => updateQuantity(product.id, nextQuantity)}
            productTitle={product.title}
            unit={product.unit}
            className="w-32"
          />
          <span className="font-bold tabular-nums text-slate-900">{formatPrice(product.price * quantity)}</span>
        </div>
        {isAtStockLimit && <p className="mt-1.5 text-xs font-medium text-amber-800">Це вся доступна кількість</p>}
      </div>
    </li>
  );
}
