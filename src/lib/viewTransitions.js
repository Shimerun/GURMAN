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
    runningTransitionCount += 1;
    const transition = startViewTransition(...args);
    transition.ready.catch((error) => {
      if (error?.name !== 'AbortError') throw error;
    });
    // `finished` rejects when the DOM update itself throws; the count must drop either way (and
    // that rejection is React Router's to report, not an unhandled one of ours).
    const markFinished = () => {
      runningTransitionCount -= 1;
    };
    transition.finished.then(markFinished, markFinished);
    return transition;
  };
}

let runningTransitionCount = 0;

/**
 * True while a view transition (card → product morph, category pill glide) is animating the
 * page, so other page-change effects can stand aside instead of doubling up.
 */
export const isViewTransitionRunning = () => runningTransitionCount > 0;
