const TILT_MAX_DEG = 4;
const PARALLAX_MAX_PX = 4;
const TILT_PROPERTIES = ['--tilt-x', '--tilt-y', '--parallax-x', '--parallax-y'];

/** @type {MediaQueryList | undefined} Created once: pointermove fires up to 120 times a second. */
let tiltQuery;

/** Mouse users who allow motion; touch screens never tilt. */
const canTilt = () => {
  tiltQuery ??= window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  return tiltQuery.matches;
};

/**
 * Product cards lean towards the pointer and the photo shifts the other way, for a hint of
 * depth. Writes per-frame CSS variables that `.card-tilt` (index.css) turns into the transform.
 * @param {import('react').PointerEvent<HTMLElement>} event
 */
export function tiltCardTowardsPointer(event) {
  if (event.pointerType !== 'mouse' || !canTilt()) return;
  const card = event.currentTarget;
  const rect = card.getBoundingClientRect();
  // -0.5 … 0.5 from the card's centre.
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;

  card.style.setProperty('--tilt-x', `${(-y * 2 * TILT_MAX_DEG).toFixed(2)}deg`);
  card.style.setProperty('--tilt-y', `${(x * 2 * TILT_MAX_DEG).toFixed(2)}deg`);
  card.style.setProperty('--parallax-x', `${(-x * 2 * PARALLAX_MAX_PX).toFixed(1)}px`);
  card.style.setProperty('--parallax-y', `${(-y * 2 * PARALLAX_MAX_PX).toFixed(1)}px`);
}

/** @param {import('react').PointerEvent<HTMLElement>} event */
export function resetCardTilt(event) {
  for (const property of TILT_PROPERTIES) event.currentTarget.style.removeProperty(property);
}
