import { cartBadge, cardPrices, currentPath, expect, open, test, waitForData } from './fixtures.js';

test.describe('catalog and filters', () => {
  test('category card navigates and adds to cart in place', async ({ page }) => {
    await open(page, '/');
    await page.locator('a[href="/category/vegetables"]').first().click();
    await expect.poll(() => currentPath(page)).toBe('/category/vegetables');
    await waitForData(page);
    await page.locator('#main article button', { hasText: 'У кошик' }).first().click();
    await expect.poll(() => cartBadge(page)).toBe(1);
    await expect(page.locator('#main article [role="group"]')).toHaveCount(1);
  });

  test('sorting is applied and kept in the URL', async ({ page }) => {
    await open(page, '/category/vegetables');
    await page.locator('#main select').selectOption('price_asc');
    await expect.poll(() => currentPath(page)).toContain('sort=price_asc');
    await waitForData(page);
    await expect
      .poll(async () => {
        const prices = await cardPrices(page);
        return prices.length > 1 && prices.every((price, index) => index === 0 || prices[index - 1] <= price);
      })
      .toBe(true);
  });

  test('filters live in the URL, survive a category switch and reset', async ({ page }) => {
    await open(page, '/category/fruits');
    const all = await page.locator('#main article').count();

    await page.locator('aside input[type="checkbox"]').first().check();
    await expect.poll(() => currentPath(page)).toContain('stock=1');
    await expect(page.locator('#main article')).toHaveCount(all - 1);

    await page.locator('aside button', { hasText: 'До ₴50' }).click();
    await expect.poll(() => currentPath(page)).toContain('max=50');
    await waitForData(page);
    await expect.poll(async () => (await cardPrices(page)).every((price) => price <= 50)).toBe(true);

    await page.locator('nav[aria-label="Категорії каталогу"] a', { hasText: 'Напої' }).click();
    await expect.poll(() => currentPath(page)).toMatch(/^\/category\/drinks\?(?=.*stock=1)(?=.*max=50)/);

    await page.locator('#main button', { hasText: 'Скинути' }).first().click();
    await expect.poll(() => currentPath(page)).toBe('/category/drinks');
  });

  test('promo-only listing shows results', async ({ page }) => {
    await open(page, '/catalog?promo=1');
    await expect(page.locator('#main')).toContainText('Знайдено');
    await expect(page.locator('#main article').first()).toBeVisible();
  });

  test('search, empty state suggestions and suggestion links', async ({ page }) => {
    await open(page, '/catalog');
    const search = page.locator('#main input[type="search"]');
    await search.fill('сир');
    await expect.poll(() => currentPath(page)).toBe('/catalog?q=сир');

    await search.fill('qwertyzzz');
    await expect(page.locator('#main')).toContainText('нічого не знайдено');
    const suggestions = page.locator('ul[aria-label="Популярні запити"] a');
    await expect(suggestions).toHaveCount(5);

    await suggestions.filter({ hasText: 'хліб' }).click();
    await expect.poll(() => currentPath(page)).toBe('/catalog?q=хліб');
    await expect(page.locator('#main article').first()).toBeVisible();
  });

  test('header search submits to the catalog', async ({ page }) => {
    await open(page, '/');
    await page.locator('header input[type="search"]').fill('банани');
    await page.locator('header input[type="search"]').press('Enter');
    await expect.poll(() => currentPath(page)).toBe('/catalog?q=банани');
  });

  test('back from a product returns to the category', async ({ page }) => {
    await open(page, '/category/dairy');
    await page.locator('#main article h3 a').first().click();
    await expect.poll(() => currentPath(page)).toMatch(/^\/product\//);
    await page.goBack();
    await expect.poll(() => currentPath(page)).toBe('/category/dairy');
  });
});
