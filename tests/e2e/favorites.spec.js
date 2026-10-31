import { currentPath, expect, open, test, waitForData } from './fixtures.js';

const FAVORITES_LINK = 'header a[href="/favorites"]';

test.describe('favourites', () => {
  test('a heart on a card saves the product; the header counts it and it survives a reload', async ({ page }) => {
    await open(page, '/catalog');
    const firstCard = page.locator('#main article').first();
    const title = (await firstCard.locator('h3').textContent()).trim();
    const heart = firstCard.getByRole('button', { name: `Обране: ${title}` });

    await expect(heart).toHaveAttribute('aria-pressed', 'false');
    await heart.click();
    await expect(heart).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator(FAVORITES_LINK)).toHaveAttribute('aria-label', 'Обране: 1 товар');

    await page.reload();
    await waitForData(page);
    await expect(page.locator(FAVORITES_LINK)).toHaveAttribute('aria-label', 'Обране: 1 товар');

    await page.locator(FAVORITES_LINK).click();
    await expect.poll(() => currentPath(page)).toBe('/favorites');
    await waitForData(page);
    await expect(page.locator('#main article')).toHaveCount(1);
    await expect(page.locator('#main article h3')).toHaveText(title);
  });

  test('un-hearting on the favourites page removes the card and shows the empty state', async ({ page }) => {
    await open(page, '/product/p-002');
    await page.locator('#main').getByRole('button', { name: 'В обране' }).click();
    await expect(page.locator('#main').getByRole('button', { name: 'В обраному' })).toBeVisible();

    await open(page, '/favorites');
    await expect(page.locator('#main article')).toHaveCount(1);
    await page.locator('#main article').getByRole('button', { name: /^Обране:/ }).click();
    await expect(page.locator('#main article')).toHaveCount(0);
    await expect(page.locator('#main h2')).toHaveText("Тут з'являться улюблені товари");
    await expect(page.locator(FAVORITES_LINK)).toHaveAttribute('aria-label', 'Обране');
  });

  test('tampered storage is ignored instead of breaking the page', async ({ page }) => {
    await page.addInitScript(() =>
      localStorage.setItem('gurman-favorites', JSON.stringify({ state: { productIds: ['p-002', 42, null, 'p-002', 'no-such-product'] }, version: 1 })),
    );
    await open(page, '/favorites');
    await expect(page.locator('#main article')).toHaveCount(1);
    await expect(page.locator(FAVORITES_LINK)).toHaveAttribute('aria-label', 'Обране: 2 товари');
  });
});
