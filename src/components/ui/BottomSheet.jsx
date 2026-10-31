import { X } from 'lucide-react';
import { useId, useRef } from 'react';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { useFocusTrap } from '../../hooks/useFocusTrap';

const CLOSE_DISTANCE_PX = 120;
const CLOSE_VELOCITY_PX_PER_MS = 0.6;

/**
 * Modal bottom sheet. Mounted only while open (callers render it conditionally).
 * @param {{
 *   title: import('react').ReactNode,
 *   onClose: () => void,
 *   children: import('react').ReactNode,
 *   footer?: import('react').ReactNode,
 * }} props
 */
export default function BottomSheet({ title, onClose, children, footer }) {
  const titleId = useId();
  const panelRef = useRef(null);
  const dragRef = useRef({ pointerId: null, startY: 0, startTime: 0, offset: 0 });

  useFocusTrap(panelRef, { isActive: true, onEscape: onClose });
  useBodyScrollLock(true);

  // Drag offset is written straight to the DOM: updating React state on every pointer
  // frame would re-render the whole sheet content while the finger moves.
  const setPanelOffset = (offset, shouldAnimate) => {
    const panel = panelRef.current;
    if (!panel) return;
    panel.style.transition = shouldAnimate ? 'transform 200ms ease-out' : 'none';
    panel.style.transform = offset > 0 ? `translateY(${offset}px)` : '';
  };

  const handlePointerDown = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    dragRef.current = { pointerId: event.pointerId, startY: event.clientY, startTime: performance.now(), offset: 0 };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event) => {
    const drag = dragRef.current;
    if (drag.pointerId !== event.pointerId) return;
    drag.offset = Math.max(0, event.clientY - drag.startY);
    setPanelOffset(drag.offset, false);
  };

  const handlePointerEnd = (event) => {
    const drag = dragRef.current;
    if (drag.pointerId !== event.pointerId) return;
    drag.pointerId = null;

    const velocity = drag.offset / Math.max(performance.now() - drag.startTime, 1);
    if (drag.offset > CLOSE_DISTANCE_PX || (drag.offset > 24 && velocity > CLOSE_VELOCITY_PX_PER_MS)) onClose();
    else setPanelOffset(0, true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <div className="absolute inset-0 animate-fade-in bg-slate-900/40" onClick={onClose} aria-hidden="true" />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative flex max-h-[90dvh] w-full animate-sheet-up flex-col overflow-y-auto overscroll-contain rounded-t-xl bg-white shadow-2xl focus:outline-none"
      >
        <div className="sticky top-0 z-10 rounded-t-xl border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
          {/* Drag zone excludes the close button: pointer capture would otherwise swallow its click. */}
          <div
            className="cursor-grab touch-none select-none px-5 pb-3 pt-2.5 active:cursor-grabbing"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerEnd}
            onPointerCancel={handlePointerEnd}
          >
            <div className="mx-auto h-1.5 w-10 rounded-full bg-slate-300" aria-hidden="true" />
            <h2 id={titleId} className="mt-3 line-clamp-2 pr-12 text-lg font-bold leading-snug text-slate-900">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрити"
            className="absolute right-3 top-4 grid min-h-11 min-w-11 place-items-center rounded-full text-slate-500 active:scale-95 active:bg-slate-100"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 px-5 py-4">{children}</div>

        {footer && (
          <div className="sticky bottom-0 border-t border-slate-200/70 bg-white/90 px-5 pt-3 backdrop-blur-md pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
