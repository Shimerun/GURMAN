import { useLayoutEffect, useRef } from 'react';
import { markLogoSplashSeen } from '../../lib/logoSplash';
import BrandLogo from '../ui/BrandLogo';

const MAX_SPLASH_SCALE = 2.2;
const SPLASH_WIDTH_RATIO = 0.7;
const POP_MS = 300;
// The basket assembles at the centre first (`.logo-splash` in index.css, ~600ms).
const FLIGHT_DELAY_MS = 650;
const FLIGHT_MS = 500;
const SKIP_EVENTS = ['pointerdown', 'keydown', 'wheel', 'touchstart'];

/**
 * Opening brand moment: the logo assembles at the centre of a cream veil, then flies into its
 * place in the header while the page (already rendered underneath) fades in. ~1.15s in total,
 * skipped by any tap, key or scroll. The header logo stays invisible until this one lands on it,
 * so the hand-over is seamless. Decorative only (aria-hidden); the caller decides when it plays.
 * @param {{ onDone: () => void }} props
 */
export default function LogoSplash({ onDone }) {
  const veilRef = useRef(/** @type {HTMLDivElement | null} */ (null));
  const lockupRef = useRef(/** @type {HTMLDivElement | null} */ (null));

  useLayoutEffect(() => {
    const target = document.querySelector('header .brand-logo');
    const lockup = lockupRef.current;
    const veil = veilRef.current;
    if (!target || !lockup || !veil) {
      onDone();
      return undefined;
    }
    markLogoSplashSeen();

    // FLIP: the copy sits exactly on the header logo; its transform starts it scaled up at the centre.
    const rect = target.getBoundingClientRect();
    lockup.style.left = `${rect.left}px`;
    lockup.style.top = `${rect.top}px`;
    const scale = Math.min(MAX_SPLASH_SCALE, (window.innerWidth * SPLASH_WIDTH_RATIO) / rect.width);
    const offsetX = window.innerWidth / 2 - (rect.width * scale) / 2 - rect.left;
    const offsetY = window.innerHeight / 2 - (rect.height * scale) / 2 - rect.top;
    const centred = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;

    const animations = [
      lockup.animate([{ opacity: 0 }, { opacity: 1 }], { duration: POP_MS, easing: 'ease-out', fill: 'backwards' }),
      lockup.animate([{ transform: centred }, { transform: 'none' }], { duration: FLIGHT_MS, delay: FLIGHT_DELAY_MS, easing: 'cubic-bezier(0.2, 0, 0, 1)', fill: 'backwards' }),
      veil.animate([{ opacity: 1 }, { opacity: 0 }], { duration: FLIGHT_MS - 50, delay: FLIGHT_DELAY_MS, easing: 'ease-out', fill: 'forwards' }),
    ];

    let isFinished = false;
    const finish = () => {
      if (isFinished) return;
      isFinished = true;
      onDone();
    };
    animations[1].onfinish = finish;
    for (const eventName of SKIP_EVENTS) window.addEventListener(eventName, finish, { passive: true });

    return () => {
      for (const eventName of SKIP_EVENTS) window.removeEventListener(eventName, finish);
      for (const animation of animations) animation.cancel();
    };
  }, [onDone]);

  return (
    // Catches taps while visible: a blind tap only skips the splash instead of hitting a hidden button.
    <div aria-hidden="true" className="fixed inset-0 z-[60]">
      <div ref={veilRef} className="absolute inset-0 bg-gray-50" />
      <div ref={lockupRef} className="logo-splash fixed origin-top-left">
        <BrandLogo showTagline isDecorative />
      </div>
    </div>
  );
}
