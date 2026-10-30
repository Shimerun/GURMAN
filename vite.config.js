import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

const THIRTY_DAYS_IN_SECONDS = 60 * 60 * 24 * 30;

export default defineConfig({
  plugins: [
    react(),
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
        navigateFallback: '/index.html',
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.origin === 'https://images.unsplash.com',
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
