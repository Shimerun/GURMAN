import { currentPath, expect, open, test } from './fixtures.js';

const SEARCH = 'header input[role="combobox"]';
const LISTBOX = 'header [role="listbox"]';

test.describe('header search suggestions', () => {
  test('typing shows matching products with prices; clicking one opens it', async ({ page }) => {
    await open(page, '/');
    const search = page.locator(SEARCH);
    await search.fill('сир');
    const listbox = page.locator(LISTBOX);
    await expect(listbox).toBeVisible();
    await expect(search).toHaveAttribute('aria-expanded', 'true');

    const options = listbox.getByRole('option');
    await expect(options.first()).toContainText(/сир/i);
    await expect(options.first()).toContainText('грн');
    await expect(options.last()).toContainText('Усі результати для «сир»');

    const title = (await options.first().locator('mark').locator('..').textContent()).trim();
    await options.first().click();
    await expect.poll(() => currentPath(page)).toMatch(/^\/product\//);
    await expect(page.locator('h1')).toHaveText(title);
    await expect(search).toHaveValue('');
  });

  test('arrow keys move through the suggestions and Enter opens the chosen one', async ({ page }) => {
    await open(page, '/');
    const search = page.locator(SEARCH);
    await search.fill('молоко');
    await expect(page.locator(`${LISTBOX} [role="option"] mark`).first()).toBeVisible();

    await search.press('ArrowDown');
    const firstOption = page.locator(`${LISTBOX} [role="option"]`).first();
    await expect(firstOption).toHaveAttribute('aria-selected', 'true');
    await expect(search).toHaveAttribute('aria-activedescendant', (await firstOption.getAttribute('id')) ?? '');

    await search.press('Enter');
    await expect.poll(() => currentPath(page)).toMatch(/^\/product\//);
  });

  test('Enter without a chosen suggestion searches the catalog; Escape clears', async ({ page }) => {
    await open(page, '/');
    const search = page.locator(SEARCH);
    await search.fill('банани');
    await expect(page.locator(LISTBOX)).toBeVisible();
    await search.press('Escape');
    await expect(search).toHaveValue('');
    await expect(page.locator(LISTBOX)).toBeHidden();

    await search.fill('банани');
    await search.press('Enter');
    await expect.poll(() => currentPath(page)).toBe('/catalog?q=банани');
  });

  test('says so when nothing matches; one letter shows no suggestions', async ({ page }) => {
    // Controlled clock: proves "nothing appears" after the debounce and mock latency without sleeping.
    await page.clock.install();
    await page.goto('/');
    await page.clock.runFor(2000);
    const search = page.locator(SEARCH);
    await search.fill('м');
    await page.clock.runFor(2000);
    await expect(page.locator(LISTBOX)).toBeHidden();
    await expect(search).toHaveAttribute('aria-expanded', 'false');

    await search.fill('ананасовийкекс');
    await page.clock.runFor(2000);
    await expect(page.locator(LISTBOX)).toContainText('Нічого не знайдено за «ананасовийкекс»');
    await expect(page.locator(`${LISTBOX} [role="option"]`)).toHaveCount(1);
  });
});
