import { Printer } from 'lucide-react';
import toast from 'react-hot-toast';
import { ANALYTICS_EVENTS, trackEvent } from '../../lib/analytics';
import { buttonClassName } from '../../lib/buttonStyles';
import { cn } from '../../lib/utils';
import { printShoppingList } from '../../lib/shoppingList';

const PRINT_LABEL = 'Роздрукувати список';

/**
 * Prints the paper shopping list (PrintableShoppingList). `isIconOnly` fits it next to the share
 * button in the cart drawer.
 * @param {{ isIconOnly?: boolean, className?: string }} props
 */
export default function PrintListButton({ isIconOnly = false, className }) {
  const handlePrint = async () => {
    trackEvent(ANALYTICS_EVENTS.printList);
    const hasStarted = await printShoppingList();
    // Hedged: a slow print preview (mobile Chrome) may still open after this.
    if (!hasStarted) toast.error('Вікно друку не відкрилося? Цей браузер, схоже, не друкує: надішліть список собі або роздрукуйте з комп’ютера.', { duration: 6000 });
  };

  if (isIconOnly) {
    return (
      <button
        type="button"
        onClick={handlePrint}
        aria-label={PRINT_LABEL}
        title={PRINT_LABEL}
        // Square twin of the secondary button, as tall as the large share button beside it.
        className={cn(
          'grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white text-slate-800 shadow-sm ring-1 ring-slate-200 transition-colors hover:text-emerald-800 hover:ring-emerald-500',
          className,
        )}
      >
        <Printer className="h-5 w-5" aria-hidden="true" />
      </button>
    );
  }

  return (
    <button type="button" onClick={handlePrint} className={buttonClassName({ variant: 'secondary', className })}>
      <Printer className="h-4 w-4" aria-hidden="true" />
      {PRINT_LABEL}
    </button>
  );
}
