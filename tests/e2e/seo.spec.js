import { expect, test } from './fixtures.js';

/**
 * What a link-preview bot or a search engine gets from the raw HTML, before any JavaScript runs.
 * @param {import('@playwright/test').APIRequestContext} request
 * @param {string} path
 */
async function readHead(request, path) {
  const response = await request.get(path);
  expect(response.status(), path).toBe(200);
  const html = await response.text();
  const meta = (attribute, key) => html.match(new RegExp(`<meta ${attribute}="${key}" content="([^"]*)"`))?.[1] ?? null;
  const jsonLd = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)?.[1];
  return {
    title: html.match(/<title>([^<]*)<\/title>/)?.[1],
    description: meta('name', 'description'),
    ogTitle: meta('property', 'og:title'),
    ogImage: meta('property', 'og:image')?.replaceAll('&amp;', '&'),
    robots: meta('name', 'robots'),
    graph: jsonLd ? JSON.parse(jsonLd)['@graph'] : [],
  };
}

test.describe('pages generated for crawlers', () => {
  test('a product URL carries its own title, description, photo and schema.org offer', async ({ request }) => {
    const head = await readHead(request, '/product/p-002');
    expect(head.title).toBe('Сир твердий «Гауда» 45% — GURMAN');
    expect(head.ogTitle).toBe(head.title);
    expect(head.description).toContain('Сир твердий «Гауда» 45%: 389');
    expect(head.ogImage).toMatch(/^https:\/\/images\.unsplash\.com\/.+w=1200/);

    const product = head.graph.find((node) => node['@type'] === 'Product');
    expect(product).toMatchObject({
      name: 'Сир твердий «Гауда» 45%',
      sku: 'p-002',
      offers: { price: '389.00', priceCurrency: 'UAH', availability: 'https://schema.org/InStock' },
    });
    // The demo ratings are invented: they must never reach search engines.
    expect(product).not.toHaveProperty('aggregateRating');
  });

  test('a category URL has its own title and photo', async ({ request }) => {
    const head = await readHead(request, '/category/dairy');
    expect(head.title).toBe('Молочні продукти та яйця — GURMAN');
    expect(head.ogImage).toMatch(/^https:\/\/images\.unsplash\.com\//);
  });

  test('home and contacts describe both stores with address and opening hours', async ({ request }) => {
    for (const path of ['/', '/contacts']) {
      const stores = (await readHead(request, path)).graph.filter((node) => node['@type'] === 'GroceryStore');
      expect(stores.map((store) => store.address.streetAddress), path).toEqual(['вул. Михайла Грушевського, 62', 'вул. Гагаріна, 13/67']);
      for (const store of stores) {
        expect(store.address.addressLocality).toBe('Житомир');
        expect(store.openingHoursSpecification).toMatchObject({ opens: '07:00', closes: '22:00' });
        expect(store.openingHoursSpecification.dayOfWeek).toHaveLength(7);
      }
    }
  });

  test('cart and favourites are kept out of search results; content pages are not', async ({ request }) => {
    expect((await readHead(request, '/cart')).robots).toBe('noindex');
    expect((await readHead(request, '/favorites')).robots).toBe('noindex');
    expect((await readHead(request, '/catalog')).robots).toBeNull();
    expect((await readHead(request, '/about')).title).toBe('Про нас — GURMAN');
  });

  test('robots.txt allows crawling', async ({ request }) => {
    const response = await request.get('/robots.txt');
    expect(response.ok()).toBe(true);
    expect(await response.text()).toContain('User-agent: *\nAllow: /');
  });

  test('the generated product page still boots the app', async ({ page }) => {
    await page.goto('/product/p-002');
    await expect(page.locator('h1')).toHaveText('Сир твердий «Гауда» 45%');
    await expect(page).toHaveTitle('Сир твердий «Гауда» 45% — GURMAN');
  });
});
