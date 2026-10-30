/** Joins truthy class names. */
export const cn = (...classNames) => classNames.filter(Boolean).join(' ');

/**
 * Requests a resized variant from image CDNs that take a `w` query param (Unsplash).
 * Other URLs, and the empty string, pass through unchanged.
 * @param {string} imageUrl
 * @param {number} width
 */
export function withImageWidth(imageUrl, width) {
  if (!imageUrl) return imageUrl;
  try {
    const url = new URL(imageUrl);
    if (!url.searchParams.has('w')) return imageUrl;
    url.searchParams.set('w', String(width));
    return url.toString();
  } catch {
    return imageUrl;
  }
}

const PLACEHOLDER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><rect width="400" height="400" fill="#eef5f0"/><g fill="none" stroke="#afd1bc" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"><path d="M110 170h180l-20 112a20 20 0 0 1-20 16H150a20 20 0 0 1-20-16z"/><path d="M155 170l30-62M245 170l-30-62"/><path d="M170 214v46M200 214v46M230 214v46"/></g></svg>`;

export const IMAGE_PLACEHOLDER = `data:image/svg+xml;utf8,${encodeURIComponent(PLACEHOLDER_SVG)}`;
