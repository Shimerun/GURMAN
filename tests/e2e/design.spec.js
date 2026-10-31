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

test.describe('micro-interactions', () => {
  test('the share button launches its paper plane', async ({ page }) => {
    await open(page, '/catalog');
    await page.locator(FIRST_CARD).first().getByRole('button', { name: /У кошик/ }).click();
    await open(page, '/cart');
    const share = page.getByRole('button', { name: 'Надіслати список собі' });
    await share.click();
    await expect(share.locator('svg.paper-plane-flight')).toHaveCount(1);
  });

  test('cart drawer lines arrive one after another', async ({ page }) => {
    await open(page, '/catalog');
    await page.locator(FIRST_CARD).nth(0).getByRole('button', { name: /У кошик/ }).click();
    await page.locator(FIRST_CARD).nth(0).getByRole('button', { name: /У кошик/ }).click();
    await page.locator('header button[aria-label^="Кошик"]').click();
    const lines = page.locator('[role="dialog"] .cart-drawer-lines > li');
    await expect(lines).toHaveCount(2);
    expect(await lines.nth(0).evaluate((line) => getComputedStyle(line).animationName)).toBe('reveal-up');
    expect(await lines.nth(1).evaluate((line) => getComputedStyle(line).animationDelay)).toBe('0.05s');
  });

  test('old prices are struck by a drawn line, finished once the card is on screen', async ({ page }) => {
    await open(page, '/catalog?promo=1');
    const oldPrice = page.locator('#main article .price-strike').first();
    await oldPrice.scrollIntoViewIfNeeded();
    expect(await oldPrice.evaluate((element) => getComputedStyle(element).textDecorationLine)).toBe('none');
    await expect
      .poll(() => oldPrice.evaluate((element) => getComputedStyle(element, '::after').transform))
      .toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
  });

  test('hero deal discounts count up to their real value', async ({ page }) => {
    await open(page, '/');
    const badge = page.locator('aside[aria-labelledby="hero-deals-heading"] li span.absolute').first();
    const realValue = (await badge.locator('.sr-only').textContent()).trim();
    expect(realValue).toMatch(/^−\d+%$/);
    await expect(badge.locator('[aria-hidden="true"]')).toHaveText(realValue);
  });

  test('the coffee cup is full and the store pins have landed once they are fully on screen', async ({ page }) => {
    await open(page, '/');
    const cup = page.locator('svg.coffee-cup');
    await cup.scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy(0, 200));
    await expect.poll(() => cup.locator('.coffee-fill').evaluate((fill) => getComputedStyle(fill).transform)).toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);

    const pin = page.locator('#stores .pin-drop').first();
    await pin.scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy(0, 200));
    await expect.poll(() => pin.evaluate((icon) => getComputedStyle(icon).opacity)).toBe('1');
  });

  test('long pages show a reading-progress bar that grows with the scroll', async ({ page }) => {
    await open(page, '/');
    await expect(page.locator('.scroll-progress')).toHaveCount(0);

    await open(page, '/privacy');
    const bar = page.locator('.scroll-progress');
    // At the top the bar is scaled to zero width, so check it is rendered rather than "visible".
    await expect(bar).toHaveCSS('display', 'block');
    const scaleAt = () => bar.evaluate((element) => new DOMMatrix(getComputedStyle(element).transform).a);
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect.poll(scaleAt).toBeLessThan(0.05);
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await expect.poll(scaleAt).toBeGreaterThan(0.95);
  });

  test('"Нагору" appears after a long scroll and brings the page back up', async ({ page }) => {
    await open(page, '/catalog');
    const backToTop = page.getByRole('button', { name: 'Нагору' });
    await expect(backToTop).toBeHidden();

    await page.evaluate(() => window.scrollTo(0, 2000));
    await expect(backToTop).toBeVisible();
    await backToTop.click();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    await expect(page.locator('#main')).toBeFocused();
    await expect(backToTop).toBeHidden();
  });

  test('product cards tilt towards the mouse and settle when it leaves', async ({ page }) => {
    await open(page, '/catalog');
    const card = page.locator('#main article').first();
    const box = await card.boundingBox();
    await page.mouse.move(box.x + box.width * 0.9, box.y + box.height * 0.1);
    await page.mouse.move(box.x + box.width * 0.85, box.y + box.height * 0.15);
    await expect.poll(() => card.evaluate((element) => element.style.getPropertyValue('--tilt-y'))).toMatch(/^\d/);
    expect(await card.evaluate((element) => element.style.getPropertyValue('--tilt-x'))).toMatch(/^\d/);

    await page.mouse.move(0, 0);
    await expect.poll(() => card.evaluate((element) => element.style.getPropertyValue('--tilt-y'))).toBe('');
  });
});

test.describe('page changes on phones', () => {
  test.use({ viewport: { width: 375, height: 800 }, isMobile: true, hasTouch: true });

  test('a new page slides in from the right, going back from the left', async ({ page }) => {
    await page.addInitScript(() => {
      window.__slides = [];
      const animate = Element.prototype.animate;
      Element.prototype.animate = function recordSlide(keyframes, options) {
        if (this.id === 'main') window.__slides.push(keyframes[0].transform);
        return animate.call(this, keyframes, options);
      };
    });
    await open(page, '/');
    expect(await page.evaluate(() => window.__slides)).toEqual([]);

    // The URL changes at once, the lazy page renders a moment later: wait for it before going back,
    // or the forward navigation is superseded and never rendered.
    await page.locator('nav[aria-label="Швидка навігація"]').getByRole('link', { name: /Магазини/ }).click();
    await expect.poll(() => currentPath(page)).toBe('/contacts');
    await expect(page.locator('#main h1')).toHaveText('Магазини та контакти');
    await page.goBack();
    await expect(page.locator('#hero-heading')).toBeVisible();
    await expect.poll(() => page.evaluate(() => window.__slides)).toEqual(['translateX(1.5rem)', 'translateX(-1.5rem)']);
  });
});

test.describe('scroll-driven effects', () => {
  /**
   * A box with `overflow: hidden` is a scroll container, so a `view()` timeline inside it tracks
   * that (never-scrolling) box and the effect silently freezes in its final state. Wrappers that
   * only need clipping must use `overflow: clip`. Horizontal rows that really scroll are allowed.
   */
  for (const path of ['/', '/catalog?promo=1', '/category/dairy', '/product/p-002', '/contacts', '/about', '/favorites']) {
    test(`no hidden-overflow box freezes a scroll timeline on ${path}`, async ({ page }) => {
      await open(page, path);
      const frozen = await page.evaluate(() => {
        const usesViewTimeline = (style) => style.animationTimeline.includes('view(') || style.viewTimelineName !== 'none';
        const findHiddenScroller = (start) => {
          for (let node = start; node && node !== document.body; node = node.parentElement) {
            if (node instanceof SVGElement) continue;
            const style = getComputedStyle(node);
            if (style.overflowX === 'hidden' || style.overflowY === 'hidden') return node;
          }
          return null;
        };
        const problems = [];
        for (const element of document.querySelectorAll('body *')) {
          const own = getComputedStyle(element);
          const after = getComputedStyle(element, '::after');
          // An element's timeline looks at its ancestors; a pseudo-element's also at its own element.
          const scroller = (usesViewTimeline(own) && findHiddenScroller(element.parentElement)) || (usesViewTimeline(after) && findHiddenScroller(element));
          if (scroller) problems.push(`${element.getAttribute('class')} inside ${scroller.getAttribute('class')}`);
        }
        return problems;
      });
      expect(frozen).toEqual([]);
    });
  }

  test('the coffee cup waits empty, then pours once it is in view', async ({ page }) => {
    await open(page, '/');
    const cup = page.locator('svg.coffee-cup');
    await expect(cup).toHaveAttribute('data-pour', 'waiting');

    await cup.scrollIntoViewIfNeeded();
    await expect(cup).toHaveAttribute('data-pour', 'pouring');
    // The rise is a real, time-based animation the visitor gets to see…
    expect(await page.locator('.coffee-fill').evaluate((fill) => fill.getAnimations().map((animation) => animation.animationName))).toEqual(['coffee-fill']);
    // …and it ends with a full cup and the lid on.
    await expect.poll(() => page.locator('.coffee-fill').evaluate((fill) => new DOMMatrix(getComputedStyle(fill).transform).f)).toBe(0);
    await expect.poll(() => page.locator('.coffee-lid').evaluate((lid) => getComputedStyle(lid).opacity)).toBe('1');
  });

  test.describe('with reduced motion', () => {
    test.use({ reducedMotion: 'reduce' });

    test('the coffee cup is simply shown full', async ({ page }) => {
      await open(page, '/');
      await expect(page.locator('svg.coffee-cup')).toHaveAttribute('data-pour', 'done');
      expect(await page.locator('.coffee-fill').evaluate((fill) => getComputedStyle(fill).transform)).toBe('none');
    });
  });
});
