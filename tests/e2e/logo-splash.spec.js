import { expect, open, test } from './fixtures.js';

const SPLASH = '.logo-splash';
const HEADER_LOGO = 'header .brand-logo';

/**
 * Records the splash mount, and whether the header logo was hidden at that moment, as it
 * happens: on a loaded machine the 1.15s splash can be over before the page's load event.
 */
async function recordSplashMount(page) {
  await page.addInitScript(() => {
    window.__splash = { mounted: false, headerHiddenOnMount: null };
    new MutationObserver(() => {
      if (window.__splash.mounted || !document.querySelector('.logo-splash')) return;
      const logo = document.querySelector('header .brand-logo');
      window.__splash = { mounted: true, headerHiddenOnMount: logo ? getComputedStyle(logo).visibility === 'hidden' : null };
    }).observe(document, { childList: true, subtree: true });
  });
}

/** Stretches the splash's own animations 20× so a test can act while it is still on screen. */
async function slowDownSplash(page) {
  await page.addInitScript(() => {
    const animate = Element.prototype.animate;
    Element.prototype.animate = function slowAnimate(keyframes, options) {
      const isSplash = this.matches('.logo-splash') || this.nextElementSibling?.matches('.logo-splash');
      if (!isSplash || typeof options !== 'object') return animate.call(this, keyframes, options);
      return animate.call(this, keyframes, { ...options, duration: options.duration * 20, delay: (options.delay ?? 0) * 20 });
    };
  });
}

test.use({ showLogoSplash: true });

test.describe('opening logo splash', () => {
  test('first visit to the home page: plays, then hands over to the header logo', async ({ page }) => {
    await recordSplashMount(page);
    await page.goto('/');
    await expect.poll(() => page.evaluate(() => window.__splash)).toEqual({ mounted: true, headerHiddenOnMount: true });

    await expect(page.locator(SPLASH)).toHaveCount(0, { timeout: 5000 });
    await expect(page.locator(HEADER_LOGO)).toHaveCSS('visibility', 'visible');
    // The splash replaces the header's own intro rather than playing it a second time.
    await expect(page.locator('header .logo-intro')).toHaveCount(0);
  });

  test('the flying logo lands exactly on the header logo', async ({ page }) => {
    await slowDownSplash(page);
    await page.goto('/');
    await expect(page.locator(SPLASH)).toBeAttached();
    const offset = await page.evaluate(([splashSelector, headerSelector]) => {
      const splash = document.querySelector(splashSelector);
      // Jump every splash animation to its end, then compare boxes before React unmounts it.
      for (const animation of splash.getAnimations({ subtree: true })) animation.currentTime = animation.effect.getComputedTiming().endTime;
      const landed = splash.getBoundingClientRect();
      const target = document.querySelector(headerSelector).getBoundingClientRect();
      return { x: Math.abs(landed.left - target.left), y: Math.abs(landed.top - target.top), width: Math.abs(landed.width - target.width) };
    }, [SPLASH, HEADER_LOGO]);
    expect(offset.x).toBeLessThan(1);
    expect(offset.y).toBeLessThan(1);
    expect(offset.width).toBeLessThan(1);
  });

  test('plays once per session: a reload shows the regular header intro', async ({ page }) => {
    await recordSplashMount(page);
    await page.goto('/');
    await expect.poll(() => page.evaluate(() => window.__splash.mounted)).toBe(true);
    await expect(page.locator(SPLASH)).toHaveCount(0, { timeout: 5000 });

    await page.reload();
    await expect(page.locator('header .logo-intro')).toHaveCount(1);
    expect(await page.evaluate(() => window.__splash.mounted)).toBe(false);
  });

  test('deep links skip it', async ({ page }) => {
    await recordSplashMount(page);
    await open(page, '/catalog');
    expect(await page.evaluate(() => window.__splash.mounted)).toBe(false);
    await expect(page.locator(HEADER_LOGO)).toHaveCSS('visibility', 'visible');
  });

  test('any key skips it at once', async ({ page }) => {
    await slowDownSplash(page);
    await page.goto('/');
    await expect(page.locator(SPLASH)).toBeAttached();
    await page.keyboard.press('Tab');
    await expect(page.locator(SPLASH)).toHaveCount(0, { timeout: 500 });
    await expect(page.locator(HEADER_LOGO)).toHaveCSS('visibility', 'visible');
  });

  test.describe('with reduced motion', () => {
    test.use({ reducedMotion: 'reduce' });

    test('never plays', async ({ page }) => {
      await recordSplashMount(page);
      await open(page, '/');
      expect(await page.evaluate(() => window.__splash.mounted)).toBe(false);
      await expect(page.locator(HEADER_LOGO)).toHaveCSS('visibility', 'visible');
    });
  });
});
