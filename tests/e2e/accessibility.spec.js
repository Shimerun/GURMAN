import { expect, open, test } from './fixtures.js';

const PAGES = ['/', '/catalog', '/category/dairy', '/product/p-002', '/cart', '/about', '/delivery', '/contacts', '/privacy', '/nope'];
const MIN_FONT_SIZE_PX = 12;

/**
 * WCAG text contrast over solid backgrounds. Skipped, as WCAG allows: text on photos/gradients
 * (it has its own scrim), screen-reader-only text and disabled controls. Returns failures as
 * readable strings.
 */
function findContrastFailures() {
  const parse = (color) => {
    const match = color.match(/rgba?\(([^)]+)\)/);
    if (!match) return null;
    const [r, g, b, a = 1] = match[1].split(/[ ,/]+/).filter(Boolean).map(Number);
    return { r, g, b, a };
  };
  const luminance = ({ r, g, b }) => {
    const channel = (value) => {
      const v = value / 255;
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
  };
  const blend = (top, bottom) => ({
    r: top.r * top.a + bottom.r * (1 - top.a),
    g: top.g * top.a + bottom.g * (1 - top.a),
    b: top.b * top.a + bottom.b * (1 - top.a),
    a: 1,
  });
  const backgroundOf = (element) => {
    const layers = [];
    for (let node = element; node; node = node.parentElement) {
      const style = getComputedStyle(node);
      if (style.backgroundImage !== 'none' || node.tagName === 'IMG') return null;
      const color = parse(style.backgroundColor);
      if (color && color.a > 0) {
        layers.push(color);
        if (color.a >= 1) break;
      }
    }
    return layers.reverse().reduce((background, layer) => blend(layer, background), { r: 255, g: 255, b: 255, a: 1 });
  };

  const failures = [];
  for (const element of document.querySelectorAll('body *')) {
    if (!element.offsetParent && getComputedStyle(element).position !== 'fixed') continue;
    if (element.closest('[aria-hidden="true"], .sr-only, :disabled, [aria-disabled="true"]')) continue;
    if (![...element.childNodes].some((node) => node.nodeType === 3 && node.textContent.trim())) continue;
    const style = getComputedStyle(element);
    if (style.visibility === 'hidden' || Number(style.opacity) < 0.5) continue;
    const background = backgroundOf(element);
    if (!background) continue;
    const foreground = blend(parse(style.color), background);
    const [light, dark] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
    const ratio = (light + 0.05) / (dark + 0.05);
    const size = parseFloat(style.fontSize);
    const isLarge = size >= 24 || (Number(style.fontWeight) >= 700 && size >= 18.66);
    if (ratio < (isLarge ? 3 : 4.5)) failures.push(`${ratio.toFixed(2)} "${element.textContent.trim().slice(0, 30)}"`);
  }
  return failures;
}

for (const viewport of [
  { name: 'mobile', width: 375, height: 800 },
  { name: 'desktop', width: 1280, height: 900 },
]) {
  test.describe(`accessibility (${viewport.name})`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    for (const path of PAGES) {
      test(`${path}: text contrast and minimum size`, async ({ page }) => {
        await open(page, path);
        expect(await page.evaluate(findContrastFailures)).toEqual([]);
        const tiny = await page.evaluate((minSize) => {
          const isVisible = (el) => el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden';
          return [...document.querySelectorAll('body *')]
            .filter((el) => isVisible(el) && [...el.childNodes].some((node) => node.nodeType === 3 && node.textContent.trim()))
            .filter((el) => !el.closest('.sr-only') && parseFloat(getComputedStyle(el).fontSize) < minSize)
            .map((el) => el.textContent.trim().slice(0, 30));
        }, MIN_FONT_SIZE_PX);
        expect(tiny).toEqual([]);
      });
    }
  });
}

test('icon-only buttons have accessible names', async ({ page }) => {
  for (const path of ['/', '/catalog', '/cart']) {
    await open(page, path);
    const unnamed = await page.locator('button').evaluateAll((buttons) =>
      buttons.filter((button) => button.getClientRects().length > 0 && !button.textContent.trim() && !button.getAttribute('aria-label')).map((button) => button.outerHTML.slice(0, 80)),
    );
    expect(unnamed, path).toEqual([]);
  }
});
