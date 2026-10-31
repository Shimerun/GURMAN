import { Copy, Send } from 'lucide-react';
import { useId, useState } from 'react';
import toast from 'react-hot-toast';
import { ANALYTICS_EVENTS, trackEvent } from '../../lib/analytics';
import { buttonClassName } from '../../lib/buttonStyles';
import { canShareNatively, copyText, formatShoppingList, getMessengerShareLinks, shareNatively } from '../../lib/shoppingList';
import { cn } from '../../lib/utils';
import { selectTotalPrice, useCartStore } from '../../store/useCartStore';

/** @param {'native' | 'viber' | 'telegram' | 'copy'} method */
const trackShare = (method) => trackEvent(ANALYTICS_EVENTS.shareList, { method });

/**
 * Sends the cart as a shopping list: the system share sheet where there is one, otherwise
 * Viber / Telegram links and copying, shown right under the button.
 * @param {{ className?: string }} props
 */
export default function ShareListButton({ className }) {
  const items = useCartStore((state) => state.items);
  const totalPrice = useCartStore(selectTotalPrice);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  // Bumped on every tap: re-keys the icon so its paper-plane flight replays.
  const [flightCount, setFlightCount] = useState(0);
  const optionsId = useId();
  const text = formatShoppingList(items, totalPrice);
  const hasNativeShare = canShareNatively();

  const handleShare = async () => {
    setFlightCount((count) => count + 1);
    if (!hasNativeShare) {
      setIsOptionsOpen((isOpen) => !isOpen);
      return;
    }
    try {
      if ((await shareNatively(text)) === 'shared') trackShare('native');
    } catch {
      setIsOptionsOpen(true);
    }
  };

  const handleCopy = async () => {
    try {
      await copyText(text);
      trackShare('copy');
      toast.success('Список скопійовано — вставте його в месенджер або нотатки');
    } catch {
      toast.error('Не вдалося скопіювати список. Надішліть його через Viber або Telegram.');
    }
  };

  const links = getMessengerShareLinks(text);
  const optionClassName = buttonClassName({ variant: 'secondary', size: 'sm', className: 'flex-1' });

  return (
    <div className={className}>
      <button
        type="button"
        onClick={handleShare}
        aria-expanded={hasNativeShare ? undefined : isOptionsOpen}
        aria-controls={isOptionsOpen ? optionsId : undefined}
        className={buttonClassName({ size: 'lg', className: 'w-full' })}
      >
        <Send key={flightCount} className={cn('h-5 w-5', flightCount > 0 && 'paper-plane-flight')} aria-hidden="true" />
        Надіслати список собі
      </button>

      {isOptionsOpen && (
        <div id={optionsId} className="mt-2 rounded-lg bg-slate-50 p-2 ring-1 ring-slate-100">
          <p className="px-1 pb-2 text-xs text-slate-600">Надіслати через:</p>
          <div className="flex flex-wrap gap-2">
            <a href={links.viber} onClick={() => trackShare('viber')} className={optionClassName}>
              Viber
            </a>
            <a href={links.telegram} onClick={() => trackShare('telegram')} target="_blank" rel="noopener noreferrer" className={optionClassName}>
              Telegram
              <span className="sr-only">(відкриється в новій вкладці)</span>
            </a>
            <button type="button" onClick={handleCopy} className={optionClassName}>
              <Copy className="h-4 w-4" aria-hidden="true" />
              Копіювати
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
