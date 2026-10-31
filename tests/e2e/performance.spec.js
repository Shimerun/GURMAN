import { expect, open, test } from './fixtures.js';

test.describe('bundle', () => {
  test('the product catalog is not part of the entry bundle; it arrives as its own chunk', async ({ page, request }) => {
    const html = await (await request.get('/')).text();
    const entryPath = html.match(/<script type="module"[^>]*src="([^"]+)"/)?.[1];
    expect(entryPath).toBeTruthy();
    const entry = await (await request.get(entryPath)).text();
    expect(entry).not.toContain('Молоко пастеризоване');

    const catalogChunk = page.waitForResponse((response) => /mockProducts-[\w-]+\.js$/.test(new URL(response.url()).pathname));
    await open(page, '/');
    expect((await catalogChunk).ok()).toBe(true);
  });
});
