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

    await page.locator('[role="dialog"] a', { hasText: 'Відкрити кошик' }).click();
    await expect.poll(() => currentPath(page)).toBe('/cart');
    await expect(page.locator('[role="dialog"]')).toHaveCount(0);
    await expect(page.locator(CART_LINES)).toHaveCount(2);

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

    const titlesBefore = await cartLineTitles(page);
    await page.locator(`${CART_LINES} button[aria-label^="Видалити"]`).first().click();
    await expect(page.locator(CART_LINES)).toHaveCount(1);
    await expect.poll(() => cartBadge(page)).toBe(1);

    await page.getByRole('button', { name: 'Повернути' }).click();
    await expect(page.locator(CART_LINES)).toHaveCount(2);
    await expect.poll(() => cartBadge(page)).toBe(3);
    // Back in its old place, not appended at the end.
    expect(await cartLineTitles(page)).toEqual(titlesBefore);
  });

  test('there is no checkout: the cart is a shopping list', async ({ page }) => {
    await addTwoProducts(page);
    await open(page, '/cart');
    await expect(page.locator('#main')).not.toContainText('Оформити');
    await expect(page.getByRole('button', { name: 'Надіслати список собі' })).toBeVisible();
  });
});

/** Titles of the cart lines, in order. @param {import('@playwright/test').Page} page */
const cartLineTitles = async (page) =>
  (await page.locator(`${CART_LINES} a[href^="/product/"]:not([aria-hidden])`).allTextContents()).map((title) => title.trim());

test.describe('shopping list', () => {
  test('sends the list through the system share sheet', async ({ page }) => {
    await page.addInitScript(() => {
      window.__shared = null;
      Object.defineProperty(Navigator.prototype, 'canShare', { configurable: true, value: () => true });
      Object.defineProperty(Navigator.prototype, 'share', { configurable: true, value: async (data) => void (window.__shared = data) });
    });
    await addTwoProducts(page);
    await open(page, '/cart');
    const titles = await cartLineTitles(page);

    await page.getByRole('button', { name: 'Надіслати список собі' }).click();
    await expect.poll(() => page.evaluate(() => window.__shared)).not.toBeNull();
    const shared = await page.evaluate(() => window.__shared);
    expect(shared.title).toBe('Список покупок GURMAN');
    expect(titles).toHaveLength(2);
    for (const title of titles) expect(shared.text).toContain(`☐ ${title}`);
    expect(shared.text).toMatch(/Разом: [\d\s,]+/);
  });

  test('without a share sheet it offers Viber, Telegram and copying', async ({ page }) => {
    await page.addInitScript(() => {
      window.__copied = null;
      Object.defineProperty(Navigator.prototype, 'share', { configurable: true, value: undefined });
      Object.defineProperty(Navigator.prototype, 'clipboard', {
        configurable: true,
        value: { writeText: async (text) => void (window.__copied = text) },
      });
    });
    await addTwoProducts(page);
    await page.locator('header button[aria-label^="Кошик"]').click();
    const drawer = page.locator('[role="dialog"]');
    const shareButton = drawer.getByRole('button', { name: 'Надіслати список собі' });
    await expect(shareButton).toHaveAttribute('aria-expanded', 'false');
    await shareButton.click();
    await expect(shareButton).toHaveAttribute('aria-expanded', 'true');

    const listParam = encodeURIComponent('Список покупок GURMAN');
    const viberHref = await drawer.getByRole('link', { name: 'Viber' }).getAttribute('href');
    expect(viberHref.startsWith(`viber://forward?text=${listParam}`)).toBe(true);
    await expect(drawer.getByRole('link', { name: /Telegram/ })).toHaveAttribute('href', /^https:\/\/t\.me\/share\/url\?url=.+&text=/);

    await drawer.getByRole('button', { name: 'Копіювати' }).click();
    await expect(page.getByText('Список скопійовано')).toBeVisible();
    expect(await page.evaluate(() => window.__copied)).toContain('Список покупок GURMAN');
  });

  test('copying works on plain-http pages without the Clipboard API', async ({ page }) => {
    // A phone opening the dev server over Wi-Fi: not a secure context, so no share sheet and no clipboard.
    await page.addInitScript(() => {
      window.__copiedWithCommand = false;
      Object.defineProperty(window, 'isSecureContext', { configurable: true, value: false });
      document.execCommand = (command) => {
        window.__copiedWithCommand = command === 'copy' && document.activeElement?.value.startsWith('Список покупок GURMAN');
        return true;
      };
    });
    await addTwoProducts(page);
    await open(page, '/cart');
    await page.getByRole('button', { name: 'Надіслати список собі' }).click();
    await page.getByRole('button', { name: 'Копіювати' }).click();
    await expect(page.getByText('Список скопійовано')).toBeVisible();
    expect(await page.evaluate(() => window.__copiedWithCommand)).toBe(true);
  });

  test('prints a paper list (from the drawer too) without the site chrome', async ({ page }) => {
    await page.addInitScript(() => {
      window.__printed = 0;
      window.print = () => {
        window.__printed += 1;
        window.dispatchEvent(new Event('beforeprint'));
      };
    });
    await addTwoProducts(page);
    await open(page, '/cart');
    const [firstTitle] = await cartLineTitles(page);

    await page.locator('header button[aria-label^="Кошик"]').click();
    await page.locator('[role="dialog"]').getByRole('button', { name: 'Роздрукувати список' }).click();
    expect(await page.evaluate(() => window.__printed)).toBe(1);

    await page.emulateMedia({ media: 'print' });
    await expect(page.locator('header').first()).toBeHidden();
    await expect(page.locator('#main')).toBeHidden();
    await expect(page.getByRole('heading', { name: 'Список покупок GURMAN' })).toBeVisible();
    await expect(page.locator('.printable-shopping-list')).toContainText(firstTitle);

    // After printing the page prints normally again.
    await page.evaluate(() => window.dispatchEvent(new Event('afterprint')));
    await expect(page.locator('#main')).toBeVisible();
    await expect(page.locator('.printable-shopping-list')).toBeHidden();
  });

  test('a print preview that opens late (mobile Chrome) still prints the list', async ({ page }) => {
    await page.clock.install();
    await page.addInitScript(() => {
      window.print = () => setTimeout(() => window.dispatchEvent(new Event('beforeprint')), 3000);
    });
    await addTwoProducts(page);
    await open(page, '/cart');
    await page.getByRole('button', { name: 'Роздрукувати список' }).click();
    await page.clock.runFor(5000);

    await page.emulateMedia({ media: 'print' });
    await expect(page.locator('.printable-shopping-list')).toBeVisible();
    await expect(page.locator('#main')).toBeHidden();
  });

  test('explains when the browser ignores the print request', async ({ page }) => {
    await page.addInitScript(() => {
      window.print = () => {};
    });
    await addTwoProducts(page);
    await open(page, '/cart');
    await page.getByRole('button', { name: 'Роздрукувати список' }).click();
    await expect(page.getByText('Вікно друку не відкрилося?')).toBeVisible();
  });
});
