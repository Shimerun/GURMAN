import { test as base, expect } from '@playwright/test';

const PLACEHOLDER_IMAGE = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 4"><rect width="4" height="4" fill="#d6e8dc"/></svg>';

/**
 * Every test gets a page that:
 * - serves product photos locally instead of hitting Unsplash (deterministic, offline-safe);
 * - fails the test on any console error or uncaught exception.
 */
export const test = base.extend({
  page: async ({ page }, use) => {
    const problems = [];
    page.on('console', (message) => {
      if (message.type() === 'error') problems.push(message.text());
    });
    page.on('pageerror', (error) => problems.push(error.message));
    await page.route(/images\.unsplash\.com/, (route) => route.fulfill({ status: 200, contentType: 'image/svg+xml', body: PLACEHOLDER_IMAGE }));

    await use(page);

    expect(problems, 'console errors / page exceptions').toEqual([]);
  },
});

export { expect };

/** Waits until loading skeletons (aria-busy) are gone. @param {import('@playwright/test').Page} page */
export async function waitForData(page) {
  await expect(page.locator('[aria-busy="true"]')).toHaveCount(0, { timeout: 10_000 });
}

/** Opens a route and waits for its data. @param {import('@playwright/test').Page} page @param {string} path */
export async function open(page, path) {
  await page.goto(path);
  await waitForData(page);
}

/** Number shown in the header cart badge. @param {import('@playwright/test').Page} page */
export async function cartBadge(page) {
  return Number(await page.locator('header button[aria-label^="Кошик"] span[aria-hidden="true"]').first().textContent());
}

/** Current path + query, decoded. @param {import('@playwright/test').Page} page */
export function currentPath(page) {
  const url = new URL(page.url());
  return decodeURIComponent(url.pathname + url.search);
}

/** Prices on the visible product cards, in order. @param {import('@playwright/test').Page} page */
export async function cardPrices(page) {
  const texts = await page.locator('#main article p span.font-extrabold').allTextContents();
  return texts.map((text) => Number(text.replace(/[^0-9]/g, '')));
}
