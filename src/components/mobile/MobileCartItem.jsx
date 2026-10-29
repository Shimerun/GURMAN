import { Trash } from 'lucide-react';
import { useRef, useState } from 'react';
import { formatPrice } from '../../lib/format';
import { useCartStore } from '../../store/useCartStore';
import QuantityStepper from '../ui/QuantityStepper';
import SafeImage from '../ui/SafeImage';

const REVEAL_WIDTH_PX = 96;
const DRAG_START_THRESHOLD_PX = 8;

/** @param {{ item: import('../../store/useCartStore').CartItem }} props */
export default function MobileCartItem({ item }) {
  const { product, quantity } = item;
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const [isRevealed, setIsRevealed] = useState(false);
  const contentRef = useRef(null);
  const gestureRef = useRef({ pointerId: null, startX: 0, startY: 0, baseOffset: 0, offset: 0, isDragging: false, didDrag: false });

  // Offset is written to the DOM directly so the row tracks the finger without per-frame re-renders.
  const setOffset = (offset, shouldAnimate) => {
    const content = contentRef.current;
    if (!content) return;
    content.style.transition = shouldAnimate ? 'transform 200ms ease-out' : 'none';
    content.style.transform = offset ? `translateX(${offset}px)` : '';
  };

  const settle = (shouldReveal) => {
    setIsRevealed(shouldReveal);
    setOffset(shouldReveal ? -REVEAL_WIDTH_PX : 0, true);
  };

  const handlePointerDown = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    const baseOffset = isRevealed ? -REVEAL_WIDTH_PX : 0;
    gestureRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      baseOffset,
      offset: baseOffset,
      isDragging: false,
      didDrag: false,
    };
  };

  const handlePointerMove = (event) => {
    const gesture = gestureRef.current;
    if (gesture.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - gesture.startX;
    const deltaY = event.clientY - gesture.startY;

    if (!gesture.isDragging) {
      if (Math.abs(deltaX) < DRAG_START_THRESHOLD_PX) return;
      // Mostly-vertical movement is a scroll; let the browser have it.
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        gesture.pointerId = null;
        return;
      }
      gesture.isDragging = true;
      // Captured only once a horizontal drag is certain, so plain taps still reach the stepper buttons.
      event.currentTarget.setPointerCapture(event.pointerId);
    }

    gesture.offset = Math.min(0, Math.max(gesture.baseOffset + deltaX, -REVEAL_WIDTH_PX * 1.25));
    setOffset(gesture.offset, false);
  };

  const handlePointerEnd = (event) => {
    const gesture = gestureRef.current;
    if (gesture.pointerId !== event.pointerId) return;
    gesture.pointerId = null;
    if (!gesture.isDragging) return;

    gesture.didDrag = true;
    settle(gesture.offset < -REVEAL_WIDTH_PX / 2);
  };

  const handleClickCapture = (event) => {
    // Swallows the click that follows a drag, and uses a tap on a revealed row to close it.
    if (gestureRef.current.didDrag) {
      gestureRef.current.didDrag = false;
      event.stopPropagation();
      event.preventDefault();
    } else if (isRevealed) {
      event.stopPropagation();
      event.preventDefault();
      settle(false);
    }
  };

  return (
    <li className="relative overflow-hidden rounded-2xl bg-red-500 shadow-soft">
      <button
        type="button"
        onClick={() => removeItem(product.id)}
        tabIndex={isRevealed ? 0 : -1}
        aria-hidden={!isRevealed}
        className="absolute inset-y-0 right-0 flex w-24 flex-col items-center justify-center gap-1 text-xs font-semibold text-white active:bg-red-600"
      >
        <Trash className="h-5 w-5" aria-hidden="true" />
        Видалити
      </button>

      <div
        ref={contentRef}
        className="relative flex touch-pan-y gap-3 bg-white p-3 ring-1 ring-inset ring-slate-100"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onClickCapture={handleClickCapture}
      >
        <SafeImage src={product.image} alt="" width={64} height={64} className="h-16 w-16 shrink-0 rounded-xl bg-emerald-50 object-cover" />

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-start justify-between gap-1">
            <h3 className="line-clamp-2 pt-0.5 text-sm font-medium leading-5 text-slate-800">{product.title}</h3>
            <button
              type="button"
              onClick={() => removeItem(product.id)}
              aria-label={`Видалити «${product.title}» з кошика`}
              className="-mr-2 -mt-2 grid min-h-11 min-w-11 shrink-0 place-items-center rounded-full text-slate-400 active:scale-95 active:text-red-600"
            >
              <Trash className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          <p className="text-xs text-slate-500">
            {formatPrice(product.price)} / {product.unit}
          </p>
          <div className="mt-2 flex items-center justify-between gap-2">
            <QuantityStepper
              size="lg"
              quantity={quantity}
              maxQuantity={product.stockQty}
              onChange={(nextQuantity) => updateQuantity(product.id, nextQuantity)}
              productTitle={product.title}
            />
            <span className="font-semibold tabular-nums text-slate-900">{formatPrice(product.price * quantity)}</span>
          </div>
        </div>
      </div>
    </li>
  );
}
