import { cartBadge, currentPath, expect, open, test, waitForData } from './fixtures.js';

const CART_LINES = 'section[aria-labelledby="cart-items-heading"] li';

/** Adds the first two in-stock catalog products. @param {import('@playwright/test').Page} page */
async function addTwoProducts(page) {
  await open(page, '/catalog');
  const buttons = page.locator('#main article button', { hasText: 'У кошик' });
  await buttons.nth(0).click();
  await expect.poll(() => cartBadge(page)).toBe(1);
  await buttons.nth(0).click();
  await expect.poll(() => cartBadge(page)).toBe(2);
}

test.describe('product page', () => {
  test('information hierarchy: title → price → promo → stock → CTA', async ({ page }) => {
    await open(page, '/product/p-002');
    const top = async (locator) => (await locator.first().boundingBox()).y;
    const main = page.locator('#main');
    const positions = [
      await top(main.locator('h1')),
      await top(main.locator('p span.font-extrabold')),
      await top(main.locator('p', { hasText: 'Акція −' })),
      await top(main.locator('dd span', { hasText: /^В наявності$/ })),
      await top(main.getByRole('button', { name: /Додати в кошик/ })),
    ];
    expect([...positions].sort((a, b) => a - b)).toEqual(positions);
  });

  test('adds the selected quantity and confirms inline', async ({ page }) => {
    await open(page, '/product/p-002');
    await page.locator('#main button[aria-label^="Збільшити"]').first().click();
    await page.getByRole('button', { name: /Додати в кошик/ }).click();
    await expect.poll(() => cartBadge(page)).toBe(2);
    await expect(page.locator('#main [role="status"]').first()).toContainText('Додано 2 кг');
  });

  test('out-of-stock product explains what to do', async ({ page }) => {
    await open(page, '/product/p-014');
    await expect(page.locator('#main')).toContainText('Зараз немає в наявності');
  });
});

test.describe('cart', () => {
  test('persists across reloads', async ({ page }) => {
    await addTwoProducts(page);
    await page.reload();
    await waitForData(page);
    await expect.poll(() => cartBadge(page)).toBe(2);
  });

  test('drawer and cart page stay in sync; quantity controls work', async ({ page }) => {
    await addTwoProducts(page);
    await page.locator('header button[aria-label^="Кошик"]').click();
    const drawerLines = page.locator('[role="dialog"][aria-labelledby="cart-title"] li');
    await expect(drawerLines).toHaveCount(2);

    await page.locator('[role="dialog"] a', { hasText: 'Оформити демо-замовлення' }).click();
    await expect.poll(() => currentPath(page)).toBe('/cart');
    await expect(page.locator('[role="dialog"] h2')).toContainText('Оформлення демо-замовлення');
    await expect(page.locator(CART_LINES)).toHaveCount(2);
    await expect(page.locator('[role="dialog"]')).toHaveAttribute('aria-describedby', /.+/);

    await page.locator('[role="dialog"] button', { hasText: 'Повернутися до кошика' }).click();
    await expect(page.locator('[role="dialog"]')).toHaveCount(0);

    await page.locator(`${CART_LINES} button[aria-label^="Збільшити"]`).first().click();
    await expect.poll(() => cartBadge(page)).toBe(3);
    await page.locator(`${CART_LINES} button[aria-label^="Зменшити"]`).first().click();
    await expect.poll(() => cartBadge(page)).toBe(2);
  });

  test('removing a line offers undo that restores its quantity', async ({ page }) => {
    await addTwoProducts(page);
    await open(page, '/cart');
    await page.locator(`${CART_LINES} button[aria-label^="Збільшити"]`).first().click();
    await expect.poll(() => cartBadge(page)).toBe(3);

    await page.locator(`${CART_LINES} button[aria-label^="Видалити"]`).first().click();
    await expect(page.locator(CART_LINES)).toHaveCount(1);
    await expect.poll(() => cartBadge(page)).toBe(1);

    await page.getByRole('button', { name: 'Повернути' }).click();
    await expect(page.locator(CART_LINES)).toHaveCount(2);
    await expect.poll(() => cartBadge(page)).toBe(3);
  });

  test('demo checkout clears the cart and back does not reopen the dialog', async ({ page }) => {
    await addTwoProducts(page);
    await open(page, '/cart');
    await page.locator('aside button', { hasText: 'Оформити демо-замовлення' }).click();
    await page.locator('[role="dialog"] button', { hasText: 'Підтвердити демо-замовлення' }).click();
    await expect.poll(() => cartBadge(page)).toBe(0);
    await expect(page.locator('[role="dialog"]')).toContainText('Демо-замовлення оформлено');

    await page.locator('[role="dialog"] a', { hasText: 'Продовжити покупки' }).click();
    await expect.poll(() => currentPath(page)).toBe('/catalog');
    await expect(page.locator('[role="dialog"]')).toHaveCount(0);

    await page.goBack();
    await expect.poll(() => currentPath(page)).toBe('/cart');
    await expect(page.locator('#main')).toContainText('Кошик порожній');
    await expect(page.locator('[role="dialog"]')).toHaveCount(0);
  });
});
