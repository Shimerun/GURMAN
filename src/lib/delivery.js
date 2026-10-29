import { DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from './constants';

/** @param {number} subtotal */
export const getAmountToFreeDelivery = (subtotal) => Math.max(FREE_DELIVERY_THRESHOLD - subtotal, 0);

/** @param {number} subtotal */
export const getDeliveryFee = (subtotal) => (getAmountToFreeDelivery(subtotal) > 0 ? DELIVERY_FEE : 0);
