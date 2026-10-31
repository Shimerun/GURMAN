import { useStores } from '../../hooks/useStores';
import { CITY, STORE_CONTACTS } from '../../lib/constants';
import { formatPrice } from '../../lib/format';
import { SHOPPING_LIST_TITLE } from '../../lib/shoppingList';
import { formatStoreHours } from '../../lib/storeHours';
import { selectTotalPrice, useCartStore } from '../../store/useCartStore';

/**
 * Paper version of the cart. Hidden on screen; while `html[data-print="shopping-list"]` is set
 * (lib/shoppingList.js `printShoppingList`) it replaces the page in print.
 */
export default function PrintableShoppingList() {
  const items = useCartStore((state) => state.items);
  const totalPrice = useCartStore(selectTotalPrice);
  const { data: stores } = useStores();

  return (
    <section className="printable-shopping-list hidden text-black">
      <h2 className="text-2xl font-bold">{SHOPPING_LIST_TITLE}</h2>
      <ul className="mt-4 text-base">
        {items.map(({ product, quantity }) => (
          <li key={product.id} className="flex items-start gap-3 border-b border-slate-300 py-2">
            <span className="mt-1 h-4 w-4 shrink-0 border-2 border-black" />
            <span className="flex-1">{product.title}</span>
            <span className="whitespace-nowrap">
              {quantity} {product.unit}
            </span>
            <span className="w-24 whitespace-nowrap text-right tabular-nums">{formatPrice(product.price * quantity)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-right text-lg font-bold tabular-nums">Разом: {formatPrice(totalPrice)}</p>
      <ul className="mt-6 space-y-1 text-sm">
        {stores.length > 0
          ? stores.map((store) => (
              <li key={store.id}>
                {store.name}: {CITY}, {store.address} · {formatStoreHours(store.hours)}
              </li>
            ))
          : <li>{STORE_CONTACTS.storeHours}</li>}
      </ul>
    </section>
  );
}
