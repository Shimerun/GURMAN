import mockStores from '../data/mockStores.json';
import { simulateNetworkLatency } from './simulateNetworkLatency';

/**
 * @typedef {Object} StoreHours
 * @property {string} open 'HH:MM', Ukraine local time
 * @property {string} close 'HH:MM', Ukraine local time ('24:00' = midnight)
 */

/**
 * All stores are in `CITY` (see lib/constants), so the city is not part of each record.
 * @typedef {Object} Store
 * @property {string} id
 * @property {string} name
 * @property {string} address
 * @property {string} phone
 * @property {StoreHours} hours
 */

/** @returns {Promise<Store[]>} */
async function getStores() {
  await simulateNetworkLatency({ service: 'storeService', operation: 'getStores' });
  return [...mockStores];
}

export const storeService = { getStores };
