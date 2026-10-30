import { cartBadge, currentPath, expect, open, test, waitForData } from './fixtures.js';

test.use({ viewport: { width: 375, height: 800 }, isMobile: true, hasTouch: true });

const ROUTES = ['/', '/catalog', '/category/dairy', '/product/p-002', '/cart', '/about', '/delivery', '/contacts'];
const STICKY_BAR = 'div.fixed:has(button:text("У кошик"))';

test.describe('mobile', () => {
  test('menu opens, navigates and closes', async ({ page }) => {
    await open(page, '/');
    const trigger = page.locator('header button[aria-label="Відкрити меню"]');
    await trigger.click();
    await expect(page.locator('#mobile-menu')).toBeVisible();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await page.locator('#mobile-menu a', { hasText: 'Хліб та випічка' }).click();
    await expect.poll(() => currentPath(page)).toBe('/category/bakery');
    await expect(page.locator('#mobile-menu')).toHaveCount(0);
  });

  test('filter sheet applies a filter and shows its count', async ({ page }) => {
    await open(page, '/category/bakery');
    await page.locator('#main button', { hasText: 'Фільтри' }).click();
    const sheet = page.locator('[role="dialog"]', { has: page.locator('h2', { hasText: 'Фільтри' }) });
    await expect(sheet).toBeVisible();
    await sheet.locator('input[type="checkbox"]').first().check();
    await waitForData(page);
    await sheet.locator('button', { hasText: 'Показати' }).click();
    await expect(page.locator('#main button[aria-haspopup="dialog"]')).toContainText('1');
  });

  test('bottom navigation marks the promo tab active', async ({ page }) => {
    await open(page, '/');
    await page.locator('nav[aria-label="Швидка навігація"] a', { hasText: 'Акції' }).click();
    await expect(page.locator('nav[aria-label="Швидка навігація"] a[aria-current="page"]')).toHaveText('Акції');
  });

  test('sticky buy bar appears only while the main button is off-screen', async ({ page }) => {
    await open(page, '/product/p-006');
    await page.getByRole('button', { name: /Додати в кошик/ }).scrollIntoViewIfNeeded();
    await expect(page.locator(STICKY_BAR)).toHaveCount(0);

    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight * 0.6));
    await expect(page.locator(STICKY_BAR)).toBeVisible();
    await page.locator(`${STICKY_BAR} button`).click();
    await expect.poll(() => cartBadge(page)).toBe(1);
  });

  test('scrolling down hides the logo row but keeps search; scrolling up restores it', async ({ page }) => {
    await open(page, '/');
    const header = page.locator('header');
    await page.evaluate(() => window.scrollTo({ top: 600, behavior: 'instant' }));
    await expect.poll(() => header.evaluate((el) => Math.round(el.getBoundingClientRect().top))).toBe(-52);
    const searchTop = await page.locator('header form[role="search"]').evaluate((el) => el.getBoundingClientRect().top);
    expect(searchTop).toBeGreaterThanOrEqual(0);

    await page.evaluate(() => window.scrollTo({ top: 500, behavior: 'instant' }));
    await expect.poll(() => header.evaluate((el) => getComputedStyle(el).transform)).toBe('none');
  });

  for (const path of ROUTES) {
    test(`${path}: no horizontal overflow at 375px`, async ({ page }) => {
      await open(page, path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBe(0);
    });
  }
});
