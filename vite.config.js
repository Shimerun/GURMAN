import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { ANALYTICS, SITE_URL } from './src/config/business.js';

const THIRTY_DAYS_IN_SECONDS = 60 * 60 * 24 * 30;
const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

/** Product photos are hotlinked from here until the client's own images are hosted with the site. */
const IMAGE_HOST = 'https://images.unsplash.com';

/** Plausible's origin, allowed only once analytics is configured (least privilege). */
const ANALYTICS_HOST = ANALYTICS.scriptSrc ? new URL(ANALYTICS.scriptSrc).origin : null;
const withAnalyticsHost = (sources) => [...sources, ANALYTICS_HOST].filter(Boolean).join(' ');

/**
 * Security headers for the production site. The build has no inline scripts, so scripts are
 * locked to our origin; styles allow 'unsafe-inline' only because react-hot-toast injects a
 * <style> tag at runtime. A new external host (analytics, maps, API) must be added here, or the
 * browser blocks it — the e2e suite runs under this policy and fails on any violation.
 */
const SECURITY_HEADERS = {
  'Content-Security-Policy': [
    "default-src 'self'",
    `script-src ${withAnalyticsHost(["'self'"])}`,
    "style-src 'self' 'unsafe-inline'",
    `img-src 'self' data: ${IMAGE_HOST}`,
    "font-src 'self'",
    // The service worker fetches (and caches) product photos itself.
    `connect-src ${withAnalyticsHost(["'self'", IMAGE_HOST])}`,
    "manifest-src 'self'",
    "worker-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join('; '),
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
  // Only honoured over HTTPS; harmless on the local http preview.
  'Strict-Transport-Security': `max-age=${ONE_YEAR_IN_SECONDS}; includeSubDomains`,
};

/** Emits `_headers` (Netlify / Cloudflare Pages format) so static hosting serves SECURITY_HEADERS. */
const securityHeadersFile = () => ({
  name: 'gurman-security-headers-file',
  apply: 'build',
  generateBundle() {
    const lines = Object.entries(SECURITY_HEADERS).map(([name, value]) => `  ${name}: ${value}`);
    this.emitFile({ type: 'asset', fileName: '_headers', source: ['/*', ...lines, ''].join('\n') });
  },
});

/** Link previews need absolute URLs: prefixes the Open Graph image (and adds og:url) once SITE_URL is known. */
const absoluteSocialMeta = () => ({
  name: 'gurman-absolute-social-meta',
  transformIndexHtml(html) {
    if (!SITE_URL) return html;
    return html
      .replace('content="/og-image.png"', `content="${SITE_URL}/og-image.png"`)
      .replace('<meta property="og:type"', `<meta property="og:url" content="${SITE_URL}/" />\n    <meta property="og:type"`);
  },
});

export default defineConfig({
  // The local preview serves the same headers, so e2e tests run under the production CSP.
  preview: { headers: SECURITY_HEADERS },
  plugins: [
    react(),
    securityHeadersFile(),
    absoluteSocialMeta(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'GURMAN',
        short_name: 'GURMAN',
        description: 'Супермаркет GURMAN у Житомирі: акції тижня, каталог і магазини поруч.',
        lang: 'uk',
        display: 'standalone',
        orientation: 'portrait',
        theme_color: '#1f4b3a',
        background_color: '#f6f4ef',
        start_url: '/',
        scope: '/',
        icons: [
          { src: '/icon.svg', sizes: '192x192', type: 'image/svg+xml', purpose: 'any maskable' },
          { src: '/icon.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'any maskable' },
          // PNG fallbacks for platforms that ignore SVG manifest icons.
          { src: '/pwa-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        // Only fetched by link-preview crawlers, never by the app.
        globIgnores: ['og-image.png'],
        navigateFallback: '/index.html',
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.origin === IMAGE_HOST,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'gurman-images',
              expiration: { maxEntries: 50, maxAgeSeconds: THIRTY_DAYS_IN_SECONDS },
              // Images load with crossorigin="anonymous", so only real 200s are cached (no opaque-response quota bloat).
              cacheableResponse: { statuses: [200] },
            },
          },
        ],
      },
    }),
  ],
});
