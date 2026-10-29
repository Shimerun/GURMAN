import { useCallback, useSyncExternalStore } from 'react';

/**
 * `beforeinstallprompt` can fire before React mounts, so it is captured at module load
 * and exposed through a tiny external store.
 */
let deferredInstallPrompt = null;
const listeners = new Set();

const notifyListeners = () => listeners.forEach((listener) => listener());

window.addEventListener('beforeinstallprompt', (event) => {
  // Suppresses the browser mini-infobar in favour of our own banner.
  event.preventDefault();
  deferredInstallPrompt = event;
  notifyListeners();
});

window.addEventListener('appinstalled', () => {
  deferredInstallPrompt = null;
  notifyListeners();
});

const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getSnapshot = () => deferredInstallPrompt;

export function useInstallPrompt() {
  const installPrompt = useSyncExternalStore(subscribe, getSnapshot);

  /** @returns {Promise<'accepted' | 'dismissed' | 'unavailable'>} */
  const promptInstall = useCallback(async () => {
    const event = deferredInstallPrompt;
    if (!event) return 'unavailable';

    // A captured prompt can only be shown once.
    deferredInstallPrompt = null;
    notifyListeners();
    await event.prompt();
    const { outcome } = await event.userChoice;
    return outcome;
  }, []);

  return { canInstall: installPrompt !== null, promptInstall };
}
