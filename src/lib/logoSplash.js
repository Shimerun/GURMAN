import { ROUTES } from './routes';

/** sessionStorage key: the splash plays at most once per browser session. */
export const LOGO_SPLASH_SEEN_KEY = 'gurman-logo-splash-seen';

/** @returns {boolean} */
function hasSeenLogoSplash() {
  try {
    return window.sessionStorage.getItem(LOGO_SPLASH_SEEN_KEY) !== null;
  } catch {
    // Storage blocked (privacy settings): we couldn't remember a play, so never start one.
    return true;
  }
}

/**
 * Whether the opening logo splash should play: first visit of the session, landing on the home
 * page (deep links go straight to their content), and motion allowed. Pure read — safe in a
 * state initializer; `markLogoSplashSeen` records the play once it actually starts.
 */
export function shouldPlayLogoSplash() {
  return (
    window.location.pathname === ROUTES.home &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
    !hasSeenLogoSplash()
  );
}

export function markLogoSplashSeen() {
  try {
    window.sessionStorage.setItem(LOGO_SPLASH_SEEN_KEY, '1');
  } catch {
    // Storage blocked: shouldPlayLogoSplash already treats that as "seen", so nothing to record.
  }
}
