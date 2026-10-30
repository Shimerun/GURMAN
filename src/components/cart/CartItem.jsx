import { Trash } from 'lucide-react';
import { Link } from 'react-router-dom';
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
  const isAtStockLimit = quantity >= product.stockQty;
  const productPath = getProductPath(product.id);

  return (
    <li className="flex gap-3 py-4">
      <Link to={productPath} tabIndex={-1} aria-hidden="true" className="shrink-0">
        <SafeImage
          src={product.image}
          alt=""
          width={80}
          height={80}
          className="h-20 w-20 rounded-xl bg-emerald-50 object-cover transition-opacity hover:opacity-90"
        />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-sm font-medium text-slate-800">
            <Link to={productPath} className="transition-colors hover:text-emerald-700">
              {product.title}
            </Link>
          </h3>
          <button
            type="button"
            onClick={() => removeItem(product.id)}
            aria-label={`Видалити «${product.title}» з кошика`}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <Trash className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <p className="text-xs text-slate-500">
          {formatPrice(product.price)} / {product.unit}
        </p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <QuantityStepper
            size="sm"
            // Removal is the trash button's job, so minus stops at 1 instead of silently dropping the line.
            minQuantity={1}
            quantity={quantity}
            maxQuantity={product.stockQty}
            onChange={(nextQuantity) => updateQuantity(product.id, nextQuantity)}
            productTitle={product.title}
          />
          <span className="font-semibold tabular-nums text-slate-900">{formatPrice(product.price * quantity)}</span>
        </div>
        {isAtStockLimit && <p className="mt-1 text-xs text-amber-700">Це вся доступна кількість</p>}
      </div>
    </li>
  );
}
