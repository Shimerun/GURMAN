import { IMAGE_PLACEHOLDER } from '../../lib/utils';

/** `<img>` that falls back to an inline SVG placeholder on empty `src` or load error. */
export default function SafeImage({ src, alt, isEager = false, ...imageProps }) {
  const handleError = (event) => {
    // Guard so a failing placeholder can never cause an error loop.
    if (event.currentTarget.src !== IMAGE_PLACEHOLDER) event.currentTarget.src = IMAGE_PLACEHOLDER;
  };

  return (
    <img
      src={src || IMAGE_PLACEHOLDER}
      alt={alt}
      loading={isEager ? 'eager' : 'lazy'}
      decoding="async"
      // CORS mode lets the service worker cache real (non-opaque) responses.
      crossOrigin="anonymous"
      onError={handleError}
      {...imageProps}
    />
  );
}
