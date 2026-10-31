import { readFileSync } from 'node:fs';
import path from 'node:path';
import { CITY, SITE_URL, STORE_PHOTO_URL } from '../src/config/business.js';
import { PROMO_VALID_UNTIL } from '../src/lib/constants.js';
import { DEFAULT_PAGE_DESCRIPTION, STATIC_PAGE_META, formatPageTitle, getCategoryPageMeta, getProductPageMeta } from '../src/lib/pageMeta.js';
import { ROUTES, getCategoryPath, getProductPath } from '../src/lib/routes.js';
import { IMAGE_SIZES } from '../src/lib/imageSizes.js';
import { buildImageSrcSet, withImageWidth } from '../src/lib/utils.js';
import { buildCatalog } from '../src/services/catalog.js';

/**
 * Build-time pages for crawlers. The site renders in the browser, so link previews (Viber,
 * Telegram, Facebook) and search engines that read only the HTML would see the same home-page
 * <head> for every URL. For each route this emits `<path>.html`, the same app shell with that
 * page's title, description, preview image, canonical URL and schema.org data; static hosts
 * (Netlify, Cloudflare Pages, GitHub Pages, `vite preview`) serve `/catalog` from `catalog.html`.
 * Also writes robots.txt and, once SITE_URL is known, sitemap.xml.
 */

const SCHEMA_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const PREVIEW_IMAGE_WIDTH = 1200;

/** Pages that only show what this browser stored: not worth indexing. */
const PRIVATE_PATHS = new Set([ROUTES.cart, ROUTES.favorites]);

/**
 * @typedef {object} SeoPage
 * @property {string} path            URL path, e.g. "/product/p-001"
 * @property {string} title           full <title>
 * @property {string} description
 * @property {{ url: string, alt: string } | null} image  null keeps the site preview image
 * @property {object[]} structuredData schema.org nodes for the page's JSON-LD @graph
 * @property {{ src: string, sizes: string } | null} [heroImage] the page's largest image (LCP),
 *   preloaded from the HTML so it starts downloading before the app has rendered
 */

/** @param {string} pagePath */
const absoluteUrl = (pagePath) => (SITE_URL ? `${SITE_URL}${pagePath === '/' ? '/' : pagePath}` : null);

/** @param {string} value */
const escapeAttribute = (value) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** @param {string} value */
const escapeText = (value) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** schema.org wants a last minute, not 24:00, for "until midnight". @param {string} time */
const toSchemaTime = (time) => (time === '24:00' ? '23:59' : time);

/** @param {any} store */
function toGroceryStore(store) {
  return {
    '@type': 'GroceryStore',
    name: store.name,
    address: { '@type': 'PostalAddress', streetAddress: store.address, addressLocality: CITY, addressCountry: 'UA' },
    telephone: store.phone,
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: SCHEMA_DAYS,
      opens: store.hours.open,
      closes: toSchemaTime(store.hours.close),
    },
    ...(SITE_URL && { url: absoluteUrl(ROUTES.contacts), image: `${SITE_URL}/og-image.png` }),
  };
}

/**
 * Search engines resolve breadcrumbs only with absolute URLs, so they need SITE_URL.
 * @param {{ name: string, path: string }[]} trail
 */
function toBreadcrumbs(trail) {
  if (!SITE_URL) return [];
  return [
    {
      '@type': 'BreadcrumbList',
      itemListElement: trail.map((crumb, index) => ({ '@type': 'ListItem', position: index + 1, name: crumb.name, item: absoluteUrl(crumb.path) })),
    },
  ];
}

/** @type {Record<import('../src/services/productService').StockStatus, string>} */
const SCHEMA_AVAILABILITY = {
  in_stock: 'https://schema.org/InStock',
  low_stock: 'https://schema.org/LimitedAvailability',
  out_of_stock: 'https://schema.org/OutOfStock',
};

/**
 * No aggregateRating: the demo ratings are invented, and search engines penalise made-up reviews.
 * @param {import('../src/services/productService').Product} product
 */
function toProduct(product) {
  return {
    '@type': 'Product',
    name: product.title,
    description: product.description,
    sku: product.id,
    category: product.categoryTitle,
    brand: { '@type': 'Brand', name: product.producer },
    ...(product.image && { image: [withImageWidth(product.image, PREVIEW_IMAGE_WIDTH)] }),
    offers: {
      '@type': 'Offer',
      price: product.price.toFixed(2),
      priceCurrency: 'UAH',
      availability: SCHEMA_AVAILABILITY[product.stockStatus],
      ...(product.isPromo && { priceValidUntil: PROMO_VALID_UNTIL }),
      ...(SITE_URL && { url: absoluteUrl(getProductPath(product.id)) }),
    },
  };
}

/**
 * @param {import('../src/services/catalog').Catalog} catalog
 * @param {any[]} stores
 * @returns {SeoPage[]}
 */
export function listSeoPages(catalog, stores) {
  const storeNodes = stores.map(toGroceryStore);
  const home = { name: 'Головна', path: ROUTES.home };
  const catalogCrumb = { name: STATIC_PAGE_META.catalog.title, path: ROUTES.catalog };
  const categoryById = new Map(catalog.categories.map((category) => [category.id, category]));

  /** @type {SeoPage[]} */
  const staticPages = Object.entries(STATIC_PAGE_META).map(([key, meta]) => ({
    path: ROUTES[/** @type {keyof typeof ROUTES} */ (key)],
    title: formatPageTitle(meta.title),
    description: meta.description,
    image: null,
    structuredData: key === 'contacts' ? storeNodes : [],
  }));

  const categoryPages = catalog.categories.map((category) => {
    const meta = getCategoryPageMeta(category);
    return {
      path: getCategoryPath(category.id),
      title: formatPageTitle(meta.title),
      description: meta.description,
      image: category.image ? { url: withImageWidth(category.image, PREVIEW_IMAGE_WIDTH), alt: category.title } : null,
      heroImage: category.image ? { src: withImageWidth(category.image, 1400), sizes: IMAGE_SIZES.categoryHeader } : null,
      structuredData: toBreadcrumbs([home, catalogCrumb, { name: category.title, path: getCategoryPath(category.id) }]),
    };
  });

  const productPages = catalog.products.map((product) => {
    const meta = getProductPageMeta(product);
    const category = categoryById.get(product.category);
    return {
      path: getProductPath(product.id),
      title: formatPageTitle(meta.title),
      description: meta.description,
      image: product.image ? { url: withImageWidth(product.image, PREVIEW_IMAGE_WIDTH), alt: product.title } : null,
      heroImage: product.image ? { src: withImageWidth(product.image, 900), sizes: IMAGE_SIZES.productPage } : null,
      structuredData: [
        toProduct(product),
        ...toBreadcrumbs([
          home,
          catalogCrumb,
          ...(category ? [{ name: category.title, path: getCategoryPath(category.id) }] : []),
          { name: product.title, path: getProductPath(product.id) },
        ]),
      ],
    };
  });

  return [
    {
      path: ROUTES.home,
      title: formatPageTitle(undefined),
      description: DEFAULT_PAGE_DESCRIPTION,
      image: null,
      heroImage: { src: STORE_PHOTO_URL, sizes: IMAGE_SIZES.hero },
      structuredData: storeNodes,
    },
    ...staticPages,
    ...categoryPages,
    ...productPages,
  ];
}

/**
 * Replaces one tag that index.html must contain; a missing tag fails the build instead of
 * silently shipping pages without it.
 * @param {string} html @param {RegExp} pattern @param {string} replacement
 */
function replaceRequired(html, pattern, replacement) {
  if (!pattern.test(html)) throw new Error(`seoPages: index.html has no tag matching ${pattern}`);
  return html.replace(pattern, replacement);
}

/** @param {string} html @param {string} attribute @param {string} key @param {string} value */
const setMeta = (html, attribute, key, value) =>
  replaceRequired(html, new RegExp(`<meta ${attribute}="${key}" content="[^"]*" />`), `<meta ${attribute}="${key}" content="${escapeAttribute(value)}" />`);

/**
 * @param {string} template the built index.html
 * @param {SeoPage} page
 */
export function renderSeoPage(template, page) {
  let html = replaceRequired(template, /<title>[^<]*<\/title>/, `<title>${escapeText(page.title)}</title>`);
  html = setMeta(html, 'name', 'description', page.description);
  html = setMeta(html, 'property', 'og:title', page.title);
  html = setMeta(html, 'property', 'og:description', page.description);

  if (page.image) {
    html = setMeta(html, 'property', 'og:image', page.image.url);
    html = setMeta(html, 'property', 'og:image:alt', page.image.alt);
    // The fixed size describes the site preview image only.
    html = html.replace(/\s*<meta property="og:image:(width|height)" content="[^"]*" \/>/g, '');
  } else if (SITE_URL) {
    html = setMeta(html, 'property', 'og:image', `${SITE_URL}/og-image.png`);
  }

  const headTags = [];
  const url = absoluteUrl(page.path);
  if (url) headTags.push(`<link rel="canonical" href="${escapeAttribute(url)}" />`, `<meta property="og:url" content="${escapeAttribute(url)}" />`);
  if (PRIVATE_PATHS.has(page.path)) headTags.push('<meta name="robots" content="noindex" />');
  if (page.heroImage) {
    // Same candidates, CORS mode and referrer policy as the page's <img> (SafeImage), or the
    // browser would not reuse the preloaded file and download the picture twice.
    const srcSet = buildImageSrcSet(page.heroImage.src);
    const candidates = srcSet ? ` imagesrcset="${escapeAttribute(srcSet)}" imagesizes="${escapeAttribute(page.heroImage.sizes)}"` : '';
    headTags.push(
      `<link rel="preload" as="image" href="${escapeAttribute(page.heroImage.src)}"${candidates} fetchpriority="high" crossorigin="anonymous" referrerpolicy="no-referrer" />`,
    );
  }
  if (page.structuredData.length > 0) {
    // A JSON data block, not a script: the CSP (script-src 'self') does not apply to it. "<" is
    // escaped so text in the data can never close the element.
    const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': page.structuredData }).replace(/</g, '\\u003c');
    headTags.push(`<script type="application/ld+json">${json}</script>`);
  }
  return headTags.length > 0 ? replaceRequired(html, /<\/head>/, `    ${headTags.join('\n    ')}\n  </head>`) : html;
}

/** @param {string} pagePath "/" → index.html, "/product/p-001" → product/p-001.html */
export const toPageFileName = (pagePath) => (pagePath === '/' ? 'index.html' : `${pagePath.slice(1)}.html`);

/** Everything may be crawled; the sitemap is announced once SITE_URL is known. */
export function renderRobotsTxt() {
  return ['User-agent: *', 'Allow: /', ...(SITE_URL ? ['', `Sitemap: ${SITE_URL}/sitemap.xml`] : []), ''].join('\n');
}

/** @param {SeoPage[]} pages Requires SITE_URL (sitemaps take absolute URLs only). */
export function renderSitemapXml(pages) {
  const urls = pages
    .filter((page) => !PRIVATE_PATHS.has(page.path))
    .map((page) => `  <url><loc>${escapeText(/** @type {string} */ (absoluteUrl(page.path)))}</loc></url>`);
  return ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">', ...urls, '</urlset>', ''].join('\n');
}

/** Vite plugin: runs after the HTML is built, reads the mock data straight from src/data. */
export function seoPages() {
  let root = process.cwd();
  /** @param {string} name */
  const readData = (name) => JSON.parse(readFileSync(path.join(root, 'src', 'data', name), 'utf8'));

  return {
    name: 'gurman-seo-pages',
    apply: 'build',
    enforce: 'post',
    /** @param {{ root: string }} config */
    configResolved(config) {
      root = config.root;
    },
    generateBundle(_options, bundle) {
      const indexHtml = bundle['index.html'];
      if (!indexHtml || indexHtml.type !== 'asset') throw new Error('seoPages: index.html is missing from the bundle');
      const template = String(indexHtml.source);

      const pages = listSeoPages(buildCatalog(readData('mockProducts.json'), readData('mockCategories.json')), readData('mockStores.json'));
      for (const page of pages) {
        const html = renderSeoPage(template, page);
        if (page.path === ROUTES.home) indexHtml.source = html;
        else this.emitFile({ type: 'asset', fileName: toPageFileName(page.path), source: html });
      }

      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: renderRobotsTxt() });
      if (SITE_URL) this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: renderSitemapXml(pages) });
    },
  };
}
