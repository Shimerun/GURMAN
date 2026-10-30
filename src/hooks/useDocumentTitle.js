import { useEffect } from 'react';

const SITE_NAME = 'GURMAN';
const DEFAULT_TITLE = `${SITE_NAME} — супермаркет свіжих продуктів у Житомирі`;
const DEFAULT_DESCRIPTION =
  'GURMAN — супермаркет свіжих продуктів у Житомирі: акції тижня, каталог із цінами та два магазини поруч.';

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
 * Sets the tab title plus the description / Open Graph tags that crawlers which run JS pick up.
 * @param {string | undefined} pageTitle Undefined while the page's data is still loading.
 * @param {string} [description] Falls back to the site-wide description.
 */
export function useDocumentTitle(pageTitle, description) {
  useEffect(() => {
    const title = pageTitle ? `${pageTitle} — ${SITE_NAME}` : DEFAULT_TITLE;
    const metaDescription = description ?? DEFAULT_DESCRIPTION;

    document.title = title;
    setMetaContent('meta[name="description"]', 'name', 'description', metaDescription);
    setMetaContent('meta[property="og:title"]', 'property', 'og:title', title);
    setMetaContent('meta[property="og:description"]', 'property', 'og:description', metaDescription);
  }, [pageTitle, description]);
}
