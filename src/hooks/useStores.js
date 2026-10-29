import { storeService } from '../services/storeService';
import { useAsyncData } from './useAsyncData';

const EMPTY_LIST = [];

/** @param {{ city?: string }} [params] */
export function useStores(params = {}) {
  const query = useAsyncData(() => storeService.getStores(params), `stores:${JSON.stringify(params)}`);
  return { ...query, /** @type {import('../services/storeService').Store[]} */ data: query.data ?? EMPTY_LIST };
}
