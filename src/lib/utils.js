/** Joins truthy class names. */
export const cn = (...classNames) => classNames.filter(Boolean).join(' ');

/** Scrolls to an anchored section; CSS `scroll-behavior` handles smoothness and reduced motion. */
export function scrollToSection(sectionId) {
  // Deferred one frame so state updates that close overlays / unlock scroll land first.
  requestAnimationFrame(() => document.getElementById(sectionId)?.scrollIntoView());
}

const PLACEHOLDER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><rect width="400" height="400" fill="#ecfdf5"/><g fill="none" stroke="#6ee7b7" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"><path d="M110 170h180l-20 112a20 20 0 0 1-20 16H150a20 20 0 0 1-20-16z"/><path d="M155 170l30-62M245 170l-30-62"/><path d="M170 214v46M200 214v46M230 214v46"/></g></svg>`;

export const IMAGE_PLACEHOLDER = `data:image/svg+xml;utf8,${encodeURIComponent(PLACEHOLDER_SVG)}`;
