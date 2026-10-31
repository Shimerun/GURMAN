import { expect, open, test } from './fixtures.js';

const SECTION = 'section[aria-labelledby="recently-viewed-heading"]';

test.describe('recently viewed', () => {
  test('is hidden until a product is opened', async ({ page }) => {
    await open(page, '/');
    await expect(page.locator(SECTION)).toHaveCount(0);
  });

  test('home lists opened products newest first; the product page leaves itself out', async ({ page }) => {
    await open(page, '/product/p-002');
    const firstTitle = (await page.locator('h1').textContent()).trim();
    await open(page, '/product/p-001');
    const secondTitle = (await page.locator('h1').textContent()).trim();
    // On p-001 the history shows only the other product.
    await expect(page.locator(`${SECTION} article`)).toHaveCount(1);
    await expect(page.locator(`${SECTION} article h3`)).toHaveText(firstTitle);

    await open(page, '/');
    await expect(page.locator(`${SECTION} article h3`)).toHaveText([secondTitle, firstTitle]);

    await page.locator(SECTION).getByRole('button', { name: 'Очистити історію' }).click();
    await expect(page.locator(SECTION)).toHaveCount(0);
    await page.reload();
    await expect(page.locator(SECTION)).toHaveCount(0);
  });
});
