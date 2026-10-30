import { defineConfig } from '@playwright/test';

const PORT = 4173;
const isCi = Boolean(process.env.CI);

/**
 * End-to-end suite against the production build (`vite preview`), so tests exercise the same
 * bundle users get. Uses the locally installed Chrome (also preinstalled on GitHub's Ubuntu
 * runners) instead of downloading Playwright's own browser.
 */
export default defineConfig({
  testDir: 'tests/e2e',
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
  webServer: {
    command: `npm run build && npx vite preview --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !isCi,
    timeout: 120_000,
  },
});
