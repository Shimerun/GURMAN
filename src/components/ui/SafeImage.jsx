import { useState } from 'react';
import { IMAGE_PLACEHOLDER, buildImageSrcSet } from '../../lib/utils';

/** @typedef {'loading' | 'loaded' | 'ready'} ImageState */

/**
 * `<img>` that falls back to an inline SVG placeholder on empty `src` or load error, and fades
 * in once loaded. Eager (above-the-fold) and already-cached images skip the fade, so the LCP
 * image and back navigation never wait on it.
 * With `sizes` (the slot's rendered width, as in HTML), resizable URLs get a `srcset`, so phones
 * download a picture for their screen instead of the largest one.
 * @param {{ src: string, alt: string, isEager?: boolean, sizes?: string } & import('react').ImgHTMLAttributes<HTMLImageElement>} props
 */
export default function SafeImage({ src, alt, isEager = false, sizes, ...imageProps }) {
  // `data-image-state` drives the fade in index.css: hidden while loading, a one-off fade when it
  // arrives, nothing at all when it was ready from the start.
  const [imageState, setImageState] = useState(/** @type {ImageState} */ (isEager ? 'ready' : 'loading'));

  /** @param {HTMLImageElement | null} image */
  const handleRef = (image) => {
    if (image?.complete && image.naturalWidth > 0 && imageState === 'loading') setImageState('ready');
  };

  const handleLoad = () => {
    if (imageState === 'loading') setImageState('loaded');
  };

  const handleError = (event) => {
    // Guard so a failing placeholder can never cause an error loop.
    if (event.currentTarget.src !== IMAGE_PLACEHOLDER) event.currentTarget.src = IMAGE_PLACEHOLDER;
  };

  return (
    <img
      ref={handleRef}
      src={src || IMAGE_PLACEHOLDER}
      srcSet={sizes && src ? buildImageSrcSet(src) : undefined}
      sizes={sizes}
      alt={alt}
      loading={isEager ? 'eager' : 'lazy'}
      decoding="async"
      // CORS mode lets the service worker cache real (non-opaque) responses.
      crossOrigin="anonymous"
      // Image hosts don't need to know which page (or search query) the visitor is on.
      referrerPolicy="no-referrer"
      onLoad={handleLoad}
      onError={handleError}
      data-image-state={imageState}
      {...imageProps}
    />
  );
}
