import { useMediaQuery } from './useMediaQuery';

/** Mirrors Tailwind's `md` breakpoint: below 768px renders the mobile app shell. */
const MOBILE_QUERY = '(max-width: 767px)';

export const useIsMobile = () => useMediaQuery(MOBILE_QUERY);
