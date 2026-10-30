import toast from 'react-hot-toast';

const UNDO_WINDOW_MS = 5000;

/**
 * "Removed · Undo" toast: a mistaken tap on the trash button costs one more tap, not a trip
 * back through the catalog.
 * @param {string} productTitle
 * @param {() => void} onUndo
 */
export function showRemovedFromCartToast(productTitle, onUndo) {
  toast(
    (currentToast) => (
      <span className="flex items-center gap-3">
        <span>«{productTitle}» видалено</span>
        <button
          type="button"
          onClick={() => {
            onUndo();
            toast.dismiss(currentToast.id);
          }}
          className="-my-2 inline-flex min-h-11 shrink-0 items-center rounded-full px-3 font-semibold text-emerald-800 underline underline-offset-2 hover:bg-emerald-50"
        >
          Повернути
        </button>
      </span>
    ),
    { duration: UNDO_WINDOW_MS },
  );
}
