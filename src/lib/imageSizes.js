/**
 * `sizes` for responsive images: how wide each picture slot is on screen. Shared by the components
 * and by the build-time preload hints (scripts/seoPages.js), which must name the same candidates
 * or the browser downloads the picture twice. Pure: Node imports this module.
 */
export const IMAGE_SIZES = {
  // On phones the banner photo sits under an 85% scrim as a faint texture, so a small file will do.
  hero: '(min-width: 1024px) 60vw, 40vw',
  productPage: '(min-width: 1024px) 40vw, 100vw',
  productCard: '(min-width: 1280px) 16vw, (min-width: 1024px) 20vw, (min-width: 640px) 30vw, 45vw',
  categoryCard: '(min-width: 768px) 33vw, 50vw',
  categoryHeader: '(min-width: 1280px) 1280px, 100vw',
  aboutPhoto: '(min-width: 1024px) 50vw, 100vw',
};

/** Pixel width for small fixed thumbnails, at 2× density. */
export const THUMBNAIL_WIDTH = {
  deal: 128,
  cartLine: 160,
  suggestion: 96,
};
