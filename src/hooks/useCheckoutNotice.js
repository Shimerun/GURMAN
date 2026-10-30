import { useCallback } from 'react';
import toast from 'react-hot-toast';

export const CHECKOUT_UNAVAILABLE_MESSAGE = 'Онлайн-оформлення замовлень ще не працює. Ваш кошик збережено — повертайтеся згодом.';

/**
 * Shared by the cart drawer and the cart page. There is no order backend yet, so checkout
 * says so honestly instead of pretending an order was placed; the cart is left untouched.
 */
export function useCheckoutNotice() {
  return useCallback(() => {
    toast(CHECKOUT_UNAVAILABLE_MESSAGE, { id: 'checkout-unavailable', icon: 'ℹ️', duration: 5000 });
  }, []);
}
