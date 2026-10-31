const TAP_VIBRATION_MS = 12;

/**
 * A barely-there tick that confirms a tap, like native shopping apps. Android browsers only:
 * iOS and desktop browsers have no Vibration API, so this is a no-op there. Must run inside the
 * tap's event handler (browsers ignore vibration without a user gesture).
 */
export function vibrateOnTap() {
  navigator.vibrate?.(TAP_VIBRATION_MS);
}
