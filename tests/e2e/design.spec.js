import { cartBadge, currentPath, expect, open, test } from './fixtures.js';

const PARTICLES = '.seasonal-particles';
const FIRST_CARD = '#main article:has(button:text("У кошик"))';

test.describe('seasonal particles', () => {
  for (const [date, season] of [
    ['2026-10-31T10:00:00Z', 'autumn'],
    ['2027-01-05T10:00:00Z', 'winter'],
    ['2027-04-15T10:00:00Z', 'spring'],
    ['2027-07-15T10:00:00Z', 'summer'],
  ]) {
    test(`switch by themselves: ${season} on ${date.slice(0, 10)}`, async ({ page }) => {
      await page.clock.setFixedTime(new Date(date));
      await open(page, '/');
      await expect(page.locator(PARTICLES)).toHaveAttribute('data-season', season);
      await expect(page.locator(`${PARTICLES} .seasonal-particle`)).toHaveCount(12);
    });
  }

  test('the season follows Kyiv time, not the visitor clock: 23:30 UTC on 30 November is already winter', async ({ page }) => {
    await page.clock.setFixedTime(new Date('2026-11-30T23:30:00Z'));
    await open(page, '/');
    await expect(page.locator(PARTICLES)).toHaveAttribute('data-season', 'winter');
  });

  test.describe('with reduced motion', () => {
    test.use({ reducedMotion: 'reduce' });

    test('are not shown', async ({ page }) => {
      await open(page, '/');
      await expect(page.locator('#hero-heading')).toBeVisible();
      await expect(page.locator(PARTICLES)).toHaveCount(0);
    });
  });
});

test('category pills use the brand icon set', async ({ page }) => {
  await open(page, '/catalog');
  const pills = page.locator('#main nav[aria-label="Категорії каталогу"] a[href^="/category/"]');
  await expect(pills).toHaveCount(9);
  for (const pill of await pills.all()) await expect(pill.locator('svg .category-icon-accent')).toHaveCount(1);
});

test.describe('card cart control', () => {
  test('"У кошик" opens into the stepper and closes back into the button', async ({ page }) => {
    await open(page, '/catalog');
    const card = page.locator(FIRST_CARD).first();
    const title = (await card.locator('h3').textContent()).trim();
    await card.getByRole('button', { name: /У кошик/ }).click();

    const stepper = page.getByRole('group', { name: `Кількість: ${title}` });
    await expect(stepper).toHaveClass(/cart-control-expand/);
    await stepper.getByRole('button', { name: /^Видалити/ }).click();
    await expect.poll(() => cartBadge(page)).toBe(0);
    await expect(page.locator('#main article', { hasText: title }).first().getByRole('button', { name: /У кошик/ })).toHaveClass(/cart-control-collapse/);
  });

  test('products already in the cart do not replay the animation on page load', async ({ page }) => {
    await open(page, '/catalog');
    const card = page.locator(FIRST_CARD).first();
    const title = (await card.locator('h3').textContent()).trim();
    await card.getByRole('button', { name: /У кошик/ }).click();
    await page.reload();
    await expect(page.getByRole('group', { name: `Кількість: ${title}` })).not.toHaveClass(/cart-control-expand/);
  });

  test('adding to the cart gives a short vibration where supported', async ({ page }) => {
    await page.addInitScript(() => {
      window.__vibrations = [];
      Object.defineProperty(Navigator.prototype, 'vibrate', { configurable: true, value: (pattern) => window.__vibrations.push(pattern) });
    });
    await open(page, '/catalog');
    await page.locator(FIRST_CARD).first().getByRole('button', { name: /У кошик/ }).click();
    expect(await page.evaluate(() => window.__vibrations)).toEqual([12]);
  });
});

test.describe('on phones', () => {
  test.use({ viewport: { width: 375, height: 800 }, isMobile: true, hasTouch: true });

  test('the tab highlight slides to the active tab and fades on pages without one', async ({ page }) => {
    await open(page, '/');
    const nav = page.locator('nav[aria-label="Швидка навігація"]');
    const highlight = nav.locator('> span[aria-hidden="true"]');
    await expect(highlight).toHaveClass(/translate-x-0/);
    // No pop on page load, only after navigating.
    await expect(nav.locator('.animate-tab-pop')).toHaveCount(0);

    await nav.getByRole('link', { name: /Магазини/ }).click();
    await expect.poll(() => currentPath(page)).toBe('/contacts');
    await expect(highlight).toHaveClass(/translate-x-\[400%\]/);
    await expect(nav.locator('a[aria-current="page"] .animate-tab-pop')).toHaveCount(1);

    await open(page, '/about');
    await expect(highlight).toHaveClass(/opacity-0/);
  });

  test('the active category pill is scrolled into view', async ({ page }) => {
    await open(page, '/category/frozen');
    const row = page.locator('#main nav[aria-label="Категорії каталогу"] ul');
    const active = row.locator('a[aria-current="page"]');
    await expect(active).toHaveCSS('view-transition-name', 'active-category');
    const [rowBox, pillBox] = [await row.boundingBox(), await active.boundingBox()];
    expect(pillBox.x).toBeGreaterThanOrEqual(rowBox.x);
    expect(pillBox.x + pillBox.width).toBeLessThanOrEqual(rowBox.x + rowBox.width + 1);
  });
});
