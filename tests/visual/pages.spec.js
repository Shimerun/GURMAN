import { cartBadge, expect, open, test } from '../e2e/fixtures.js';

/**
 * Screenshot baselines of the key pages, to catch layouts that silently break. Time is frozen
 * (a Monday morning, stores open, autumn) and motion is off (playwright.config.js), so every
 * run renders the same pixels. After an intended design change, refresh the baselines with
 * `npm run test:visual:update` and review the new images before committing them.
 */

const FROZEN_TIME = new Date('2026-11-02T08:00:00Z');

/**
 * Loads every lazy image and waits for fonts, so a full-page capture never catches half-loaded
 * pictures below the fold.
 * @param {import('@playwright/test').Page} page
 */
async function settle(page) {
  await page.evaluate(() => {
    for (const image of document.querySelectorAll('img[loading="lazy"]')) image.loading = 'eager';
  });
  await expect(page.locator('img[data-image-state="loading"]')).toHaveCount(0);
  await page.evaluate(() => document.fonts.ready);
}

/** @param {import('@playwright/test').Page} page */
async function addTwoProductsToCart(page) {
  await open(page, '/catalog');
  const addButtons = page.locator('#main article button', { hasText: 'У кошик' });
  await addButtons.nth(0).click();
  await expect.poll(() => cartBadge(page)).toBe(1);
  await addButtons.nth(0).click();
  await expect.poll(() => cartBadge(page)).toBe(2);
}

for (const [device, viewport] of [
  ['desktop', { width: 1366, height: 900 }],
  ['phone', { width: 375, height: 800 }],
]) {
  test.describe(device, () => {
    test.use({ viewport, ...(device === 'phone' && { isMobile: true, hasTouch: true }) });

    test.beforeEach(async ({ page }) => {
      await page.clock.setFixedTime(FROZEN_TIME);
    });

    test('home', async ({ page }) => {
      await open(page, '/');
      await settle(page);
      await expect(page).toHaveScreenshot(`home-${device}.png`, { fullPage: true });
    });

    test('catalog (first screen)', async ({ page }) => {
      await open(page, '/catalog');
      await settle(page);
      await expect(page).toHaveScreenshot(`catalog-${device}.png`);
    });

    test('product page', async ({ page }) => {
      await open(page, '/product/p-002');
      await settle(page);
      await expect(page).toHaveScreenshot(`product-${device}.png`, { fullPage: true });
    });

    test('cart with two products', async ({ page }) => {
      await addTwoProductsToCart(page);
      await open(page, '/cart');
      await settle(page);
      await expect(page).toHaveScreenshot(`cart-${device}.png`, { fullPage: true });
    });

    test('stores and contacts', async ({ page }) => {
      await open(page, '/contacts');
      await settle(page);
      await expect(page).toHaveScreenshot(`contacts-${device}.png`, { fullPage: true });
    });

    test('not found', async ({ page }) => {
      await open(page, '/no-such-page');
      await settle(page);
      await expect(page).toHaveScreenshot(`not-found-${device}.png`);
    });
  });
}
