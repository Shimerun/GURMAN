import { cartBadge, currentPath, expect, open, test } from './fixtures.js';

const FALLBACK_PLACEHOLDER = 'Знайти продукти: молоко, сир, банани…';

/** Animations created by script (WAAPI), as opposed to CSS animations/transitions. */
const countScriptAnimations = (elements) => elements.filter((el) => el.getAnimations().some((a) => !(a instanceof CSSAnimation) && !(a instanceof CSSTransition))).length;

test.describe('motion', () => {
  test('logo intro plays once and ends fully visible', async ({ page }) => {
    await page.goto('/');
    const logo = page.locator('header .logo-intro');
    await expect(logo).toHaveCount(1);
    await expect.poll(() => logo.evaluate((el) => el.getAnimations({ subtree: true }).filter((a) => a.playState === 'running').length)).toBe(0);
    const allVisible = await logo.evaluate((el) => [...el.querySelectorAll('*')].every((child) => Number(getComputedStyle(child).opacity) === 1));
    expect(allVisible).toBe(true);
    await expect(page.locator('footer .logo-intro')).toHaveCount(0);
  });

  test('adding to cart throws an orange into the header cart', async ({ page }) => {
    await open(page, '/catalog');
    await page.locator('#main article button', { hasText: 'У кошик' }).first().click();
    await expect(page.locator('.cart-flyer')).toHaveCount(1);
    await expect(page.locator('.cart-flyer')).toHaveCount(0);
    await expect.poll(() => cartBadge(page)).toBe(1);
  });

  test('product card image morphs into the product page (view transition)', async ({ page }) => {
    await page.addInitScript(() => {
      window.__viewTransitions = [];
      const original = document.startViewTransition?.bind(document);
      if (!original) return;
      document.startViewTransition = (update) => {
        const named = [...document.querySelectorAll('*')].filter((el) => getComputedStyle(el).viewTransitionName === 'product-image');
        window.__viewTransitions.push(named.length);
        return original(update);
      };
    });
    await open(page, '/catalog');
    await page.locator('#main article').first().hover();
    await page.locator('#main article h3 a').first().click();
    await expect.poll(() => currentPath(page)).toMatch(/^\/product\//);
    // Exactly one element carried the shared name when the transition started.
    expect(await page.evaluate(() => window.__viewTransitions)).toEqual([1]);
  });

  test('going back mid-transition is not an uncaught error', async ({ page }) => {
    await open(page, '/category/dairy');
    await page.locator('#main article').first().hover();
    await page.locator('#main article h3 a').first().click();
    // Back while the 350ms morph is still running: react-router skips the in-flight transition.
    await page.goBack();
    await expect.poll(() => currentPath(page)).toBe('/category/dairy');
    await page.waitForTimeout(600);
  });

  test('sorting glides cards to their new places', async ({ page }) => {
    await open(page, '/catalog');
    await page.locator('#main select').selectOption('price_asc');
    await expect
      .poll(() => page.locator('#main ul li[data-flip-key]').evaluateAll(countScriptAnimations), { intervals: [50] })
      .toBeGreaterThan(0);
  });

  test('search placeholder types examples and pauses on focus', async ({ page }) => {
    await page.goto('/');
    const search = page.locator('header input[type="search"]');
    await expect.poll(() => search.getAttribute('placeholder'), { timeout: 6000 }).toMatch(/^Знайти: /);
    await search.focus();
    await expect(search).toHaveAttribute('placeholder', FALLBACK_PLACEHOLDER);
  });

  test('"open now" stores show a pulsing dot', async ({ page }) => {
    await page.clock.setFixedTime(new Date('2026-10-30T10:00:00Z'));
    await open(page, '/contacts');
    await expect(page.locator('#stores article', { hasText: 'Відкрито зараз' })).toHaveCount(2);
    await expect(page.locator('#stores span.motion-safe\\:animate-ping-slow')).toHaveCount(2);
  });

  test('contact form shakes invalid fields and draws the success tick', async ({ page }) => {
    await open(page, '/contacts');
    await page.getByRole('button', { name: 'Надіслати' }).click();
    const shaking = await page.locator('form [name="name"], form [name="email"], form [name="message"]').evaluateAll((fields) => fields.filter((field) => field.getAnimations().length > 0).length);
    expect(shaking).toBe(3);

    await page.getByLabel('Ім’я').fill('Олена');
    await page.getByLabel('Електронна пошта').fill('olena@example.com');
    await page.getByLabel('Повідомлення').fill('Чи є безлактозне молоко?');
    await page.getByRole('button', { name: 'Надіслати' }).click();
    await expect(page.locator('.check-draw')).toBeVisible();
  });
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('no logo intro, no flying orange, static search placeholder', async ({ page }) => {
    await open(page, '/');
    expect(await page.locator('header .logo-intro').evaluate((el) => el.getAnimations({ subtree: true }).length)).toBe(0);
    await page.waitForTimeout(2500);
    await expect(page.locator('header input[type="search"]')).toHaveAttribute('placeholder', FALLBACK_PLACEHOLDER);

    await open(page, '/catalog');
    await page.locator('#main article button', { hasText: 'У кошик' }).first().click();
    await expect.poll(() => cartBadge(page)).toBe(1);
    await expect(page.locator('.cart-flyer')).toHaveCount(0);
  });

  test('scroll-revealed cards are visible without scrolling', async ({ page }) => {
    await open(page, '/');
    const hidden = await page.locator('.scroll-reveal').evaluateAll((items) => items.filter((item) => getComputedStyle(item).opacity !== '1').length);
    expect(hidden).toBe(0);
  });
});
