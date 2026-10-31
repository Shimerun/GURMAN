import { defineConfig } from '@playwright/test';

const PORT = 4173;
const isCi = Boolean(process.env.CI);

/**
 * End-to-end suite against the production build (`vite preview`), so tests exercise the same
 * bundle users get. Uses the locally installed Chrome (also preinstalled on GitHub's Ubuntu
 * runners) instead of downloading Playwright's own browser.
 *
 * Two projects: `e2e` (behaviour; `npm test`, CI) and `visual` (screenshots compared with
 * committed baselines; `npm run test:visual`). Screenshots differ between operating systems
 * (fonts, antialiasing), so baselines are per platform and the visual project is not run in CI.
 */
export default defineConfig({
  fullyParallel: true,
  forbidOnly: isCi,
  retries: isCi ? 1 : 0,
  workers: isCi ? 2 : undefined,
  reporter: isCi ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    channel: 'chrome',
    viewport: { width: 1366, height: 900 },
    locale: 'uk-UA',
    timezoneId: 'Europe/Kyiv',
    // The PWA service worker would cache responses across tests.
    serviceWorkers: 'block',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'e2e', testDir: 'tests/e2e' },
    {
      name: 'visual',
      testDir: 'tests/visual',
      // No motion: every animation, particle and count-up rests in its final state.
      use: { reducedMotion: 'reduce' },
      expect: { toHaveScreenshot: { animations: 'disabled', maxDiffPixelRatio: 0.01 } },
    },
  ],
  webServer: {
    command: `npm run build && npx vite preview --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !isCi,
    timeout: 120_000,
  },
});
