import { cartBadge, expect, open, test } from './fixtures.js';

const XSS_PAYLOAD = '"><img src=x onerror=alert(1)><script>alert(2)</script>';

const VALID_PRODUCT = { id: 'p-002', title: 'Молоко', unit: 'шт', image: '', price: 42, oldPrice: 60, stockQty: 5, badges: [] };

/** Writes a raw persisted cart, as an older site version or a browser extension could leave it. */
async function seedCart(page, persistedValue) {
  await page.goto('/');
  await page.evaluate((value) => localStorage.setItem('gurman-cart', value), persistedValue);
}

test.describe('security', () => {
  test('production headers: CSP, clickjacking and sniffing protection', async ({ page }) => {
    const response = await page.goto('/');
    const headers = response.headers();
    expect(headers['content-security-policy']).toContain("script-src 'self'");
    expect(headers['content-security-policy']).toContain("frame-ancestors 'none'");
    expect(headers['content-security-policy']).toContain("object-src 'none'");
    expect(headers['x-frame-options']).toBe('DENY');
    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
  });

  for (const path of [`/catalog?q=${encodeURIComponent(XSS_PAYLOAD)}`, `/category/${encodeURIComponent(XSS_PAYLOAD)}`, `/product/${encodeURIComponent(XSS_PAYLOAD)}`]) {
    test(`URL input is rendered as text: ${path.split('?')[0]}`, async ({ page }) => {
      let dialogs = 0;
      page.on('dialog', async (dialog) => {
        dialogs += 1;
        await dialog.dismiss();
      });
      await open(page, path);
      const injected = await page.evaluate(() => document.querySelectorAll('img[src="x"], body script:not([src])').length);
      expect(injected).toBe(0);
      expect(dialogs).toBe(0);
    });
  }

  test('malformed cart data is dropped instead of breaking the site', async ({ page }) => {
    const items = [
      { product: null, quantity: 1 },
      { product: { ...VALID_PRODUCT, id: 'p-bad', price: '9e9' }, quantity: 1 },
      { product: { ...VALID_PRODUCT, id: 'p-neg' }, quantity: -5 },
      { product: VALID_PRODUCT, quantity: 99 },
    ];
    await seedCart(page, JSON.stringify({ state: { items }, version: 2 }));
    await open(page, '/cart');
    await expect(page.locator('h1')).toHaveText('Кошик');
    await expect(page.locator('section[aria-labelledby="cart-items-heading"] li')).toHaveCount(1);
    // The surviving line is capped to the stock it was added with.
    await expect.poll(() => cartBadge(page)).toBe(VALID_PRODUCT.stockQty);
  });

  for (const [name, value] of [
    ['items is not a list', JSON.stringify({ state: { items: 'boom' }, version: 2 })],
    ['not JSON at all', '{broken'],
  ]) {
    test(`corrupted cart storage (${name}) shows an empty cart`, async ({ page }) => {
      await seedCart(page, value);
      await open(page, '/cart');
      await expect(page.locator('h1')).toHaveText('Кошик');
      await expect(page.locator('#main')).toContainText('Кошик порожній');
      await expect.poll(() => cartBadge(page)).toBe(0);
    });
  }

  test('external links cannot reach back into the site (noopener)', async ({ page }) => {
    await open(page, '/contacts');
    const unsafe = await page.locator('a[target="_blank"]').evaluateAll((links) => links.filter((link) => !/\bnoopener\b/.test(link.rel)).map((link) => link.href));
    expect(unsafe).toEqual([]);
  });

  test('contact form limits field length', async ({ page }) => {
    await open(page, '/contacts');
    for (const name of ['name', 'email', 'message']) {
      await expect(page.locator(`form [name="${name}"]`)).toHaveAttribute('maxlength', /^\d+$/);
    }
  });
});
