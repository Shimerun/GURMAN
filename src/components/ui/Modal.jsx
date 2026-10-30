import { X } from 'lucide-react';
import { useId, useRef } from 'react';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { useFocusTrap } from '../../hooks/useFocusTrap';

/**
 * Centered dialog (bottom-aligned on phones). Mounted only while open: callers render it conditionally.
 * @param {{
 *   title: string,
 *   description?: import('react').ReactNode,
 *   onClose: () => void,
 *   children: import('react').ReactNode,
 *   footer?: import('react').ReactNode,
 * }} props `description` becomes the dialog's accessible description.
 */
export default function Modal({ title, description, onClose, children, footer }) {
  const titleId = useId();
  const descriptionId = useId();
  const panelRef = useRef(null);

  useFocusTrap(panelRef, { isActive: true, onEscape: onClose });
  useBodyScrollLock(true);

  return (
    <div className="fixed inset-0 z-[55] flex items-end justify-center sm:items-center sm:p-6">
      <div className="absolute inset-0 animate-fade-in bg-slate-900/50" onClick={onClose} aria-hidden="true" />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className="pb-safe relative flex max-h-[90dvh] w-full animate-sheet-up flex-col overflow-y-auto overscroll-contain rounded-t-3xl bg-white shadow-2xl focus:outline-none sm:max-w-lg sm:animate-fade-in sm:rounded-3xl"
      >
        <div className="flex items-start justify-between gap-4 px-5 pt-5 sm:px-6 sm:pt-6">
          <div className="min-w-0">
            <h2 id={titleId} className="text-xl font-bold text-slate-900">
              {title}
            </h2>
            {description && (
              <div id={descriptionId} className="mt-1.5 text-sm leading-relaxed text-slate-600">
                {description}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрити"
            className="-mr-2 -mt-2 grid h-11 w-11 shrink-0 place-items-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="px-5 py-4 sm:px-6">{children}</div>

        {footer && <div className="border-t border-slate-100 px-5 py-4 sm:px-6">{footer}</div>}
      </div>
    </div>
  );
}
