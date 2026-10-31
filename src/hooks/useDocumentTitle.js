import { useEffect } from 'react';
import { DEFAULT_PAGE_DESCRIPTION, formatPageTitle } from '../lib/pageMeta';

/** @param {string} selector @param {string} attribute @param {string} key */
function setMetaContent(selector, attribute, key, content) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

/**
 * Sets the tab title plus the description / Open Graph tags when the visitor moves between pages.
 * Crawlers that don't run JS get the same values from the HTML generated at build time
 * (scripts/seoPages.js); texts live in lib/pageMeta.js for both.
 * @param {string | undefined} pageTitle Undefined while the page's data is still loading.
 * @param {string} [description] Falls back to the site-wide description.
 */
export function useDocumentTitle(pageTitle, description) {
  useEffect(() => {
    const title = formatPageTitle(pageTitle);
    const metaDescription = description ?? DEFAULT_PAGE_DESCRIPTION;

    document.title = title;
    setMetaContent('meta[name="description"]', 'name', 'description', metaDescription);
    setMetaContent('meta[property="og:title"]', 'property', 'og:title', title);
    setMetaContent('meta[property="og:description"]', 'property', 'og:description', metaDescription);
  }, [pageTitle, description]);
}
