import { currentPath, expect, open, test } from './fixtures.js';

const NOT_FOUND_STATES = [
  ['/category/unknown', 'Такої категорії не існує'],
  ['/product/unknown', 'Товар не знайдено'],
  ['/totally/unknown', 'Сторінку не знайдено'],
];

const PAGES = ['/', '/catalog', '/category/dairy', '/product/p-002', '/cart', '/about', '/delivery', '/contacts'];

test.describe('routes', () => {
  for (const [path, heading] of NOT_FOUND_STATES) {
    test(`${path} shows "${heading}"`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('h1')).toHaveText(heading);
    });
  }

  test('delivery page renders the how-to-buy guide', async ({ page }) => {
    await page.goto('/delivery');
    await expect(page.locator('h1')).toHaveText('Як купити в GURMAN');
  });

  for (const path of PAGES) {
    test(`${path}: one h1 and no skipped heading levels`, async ({ page }) => {
      await open(page, path);
      await expect(page.locator('h1')).toHaveCount(1);
      const levels = await page.locator('h1, h2, h3, h4').evaluateAll((headings) => headings.map((h) => Number(h.tagName[1])));
      const skips = levels.filter((level, index) => index > 0 && level - levels[index - 1] > 1);
      expect(skips, `heading levels ${levels.join(',')}`).toEqual([]);
    });
  }

  test('hero CTA opens the weekly deals listing', async ({ page }) => {
    await open(page, '/');
    await expect(page.locator('section[aria-labelledby="hero-heading"]')).toContainText('Житомир · 2 магазини');
    await expect(page.locator('aside[aria-labelledby="hero-deals-heading"] li')).toHaveCount(3);
    await page.locator('section[aria-labelledby="hero-heading"] a', { hasText: 'Акції тижня' }).click();
    await expect.poll(() => currentPath(page)).toBe('/catalog?promo=1&sort=discount');
    await expect(page.locator('ul[aria-label="Активні фільтри"] button')).toHaveCount(1);
  });

  test('store data: two stores, 07:00–22:00, no delivery or 24/7 copy', async ({ page }) => {
    await open(page, '/contacts');
    const stores = page.locator('#stores article');
    await expect(stores).toHaveCount(2);
    await expect(stores.nth(0)).toContainText('вул. Михайла Грушевського, 62');
    await expect(stores.nth(1)).toContainText('вул. Гагаріна, 13/67');
    await expect(stores.nth(0)).toContainText('07:00–22:00');
    for (const path of ['/', '/contacts', '/delivery', '/about', '/cart']) {
      await open(page, path);
      const text = await page.locator('body').innerText();
      expect(text, path).not.toMatch(/доставк|цілодоб|24\/7|з 5:00/i);
    }
  });
});
