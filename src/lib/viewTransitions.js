/**
 * React Router skips an in-flight view transition when a new navigation interrupts it (e.g.
 * Back pressed during the card → product morph). Per spec, skipping rejects the transition's
 * `ready` promise with an AbortError, and React Router leaves that promise unhandled, so a
 * normal user action shows up as "Uncaught (in promise)". This marks only that expected
 * rejection as handled; any other failure is rethrown and stays visible.
 */
export function handleSkippedViewTransitions() {
  if (typeof document.startViewTransition !== 'function') return;

  const startViewTransition = document.startViewTransition.bind(document);
  document.startViewTransition = (...args) => {
    const transition = startViewTransition(...args);
    transition.ready.catch((error) => {
      if (error?.name !== 'AbortError') throw error;
    });
    return transition;
  };
}
