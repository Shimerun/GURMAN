import mockStores from '../data/mockStores.json';
import { simulateNetworkLatency } from './simulateNetworkLatency';

/**
 * @typedef {Object} StoreHours
 * @property {string} open 'HH:MM', Kyiv time
 * @property {string} close 'HH:MM', Kyiv time ('24:00' = midnight)
 */

/**
 * @typedef {Object} Store
 * @property {string} id
 * @property {string} name
 * @property {string} city
 * @property {string} address
 * @property {string} phone
 * @property {StoreHours} hours
 */

/**
 * @param {{ city?: string }} [params]
 * @returns {Promise<Store[]>}
 */
async function getStores({ city } = {}) {
  await simulateNetworkLatency({ service: 'storeService', operation: 'getStores' });
  return city ? mockStores.filter((store) => store.city === city) : [...mockStores];
}

export const storeService = { getStores };
