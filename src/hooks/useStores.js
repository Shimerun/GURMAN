import { storeService } from '../services/storeService';
import { useAsyncData } from './useAsyncData';

const EMPTY_LIST = [];

export function useStores() {
  const query = useAsyncData(() => storeService.getStores(), 'stores');
  return { ...query, /** @type {import('../services/storeService').Store[]} */ data: query.data ?? EMPTY_LIST };
}
