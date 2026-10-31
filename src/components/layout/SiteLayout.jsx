import { Suspense, useCallback, useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom';
import { useIsMobile } from '../../hooks/useIsMobile';
import { shouldPlayLogoSplash } from '../../lib/logoSplash';
import { TOAST_OPTIONS } from '../../lib/toastOptions';
import { useCartStore } from '../../store/useCartStore';
import CartDrawer from '../cart/CartDrawer';
import BottomNav from '../mobile/BottomNav';
import BasketIllustration from '../ui/BasketIllustration';
import Footer from './Footer';
import LogoSplash from './LogoSplash';
import MobileMenu from './MobileMenu';
import Navbar from './Navbar';
import TopStrip from './TopStrip';

export default function SiteLayout() {
  const { key: locationKey } = useLocation();
  const isMobile = useIsMobile();
  const closeCart = useCartStore((state) => state.closeCart);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Decided once per page load: the splash replaces the header logo's own intro animation.
  const [hasLogoSplash] = useState(shouldPlayLogoSplash);
  const [isLogoSplashActive, setIsLogoSplashActive] = useState(hasLogoSplash);
  const endLogoSplash = useCallback(() => setIsLogoSplashActive(false), []);

  // Any navigation (including to the current URL) dismisses overlays, so links inside them need no extra wiring.
  useEffect(() => {
    closeCart();
    setIsMobileMenuOpen(false);
  }, [locationKey, closeCart]);

  return (
    // Below `md` the fixed bottom nav (3.5rem + home-indicator inset) would otherwise cover the footer.
    <div className="flex min-h-screen flex-col pb-[calc(3.5rem+env(safe-area-inset-bottom))] md:pb-0">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-5 focus:py-3 focus:font-semibold focus:text-emerald-800 focus:shadow-lg"
      >
        Перейти до основного вмісту
      </a>

      <TopStrip />
      <Navbar
        isMobileMenuOpen={isMobileMenuOpen}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        isLogoIntroAnimated={!hasLogoSplash}
        isLogoHidden={isLogoSplashActive}
      />

      <main id="main" tabIndex={-1} className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 focus:outline-none sm:px-6 sm:py-8 lg:px-8">
        <Suspense fallback={<PageFallback />}>
          <Outlet />
        </Suspense>
      </main>

      <Footer />
      <BottomNav />
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <CartDrawer />

      {/* On phones toasts go on top, clear of the bottom nav. */}
      <Toaster
        position={isMobile ? 'top-center' : 'bottom-center'}
        toastOptions={TOAST_OPTIONS}
        containerClassName={isMobile ? '!top-[calc(env(safe-area-inset-top)+0.75rem)]' : undefined}
      />
      <ScrollRestoration getKey={getScrollRestorationKey} />
      {isLogoSplashActive && <LogoSplash onDone={endLogoSplash} />}
    </div>
  );
}

/** Shown while a lazy page chunk loads; fades in only after a short delay, so fast loads show nothing. */
function PageFallback() {
  return (
    <div role="status" aria-busy="true" aria-label="Завантаження сторінки" className="page-fallback grid min-h-[50vh] place-items-center">
      <BasketIllustration variant="loading" />
    </div>
  );
}

/**
 * Entries opened by a full page load (typed URL, external link) all share the key "default",
 * so the default keying would restore the previous page's scroll onto an unrelated URL.
 * @param {import('react-router-dom').Location} location
 */
function getScrollRestorationKey(location) {
  return location.key === 'default' ? `${location.pathname}${location.search}` : location.key;
}
