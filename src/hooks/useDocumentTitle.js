import { useEffect } from 'react';

const SITE_NAME = 'GURMAN';
const DEFAULT_TITLE = `${SITE_NAME} — продуктовий супермаркет`;

/** @param {string | undefined} pageTitle Undefined while the page's data is still loading. */
export function useDocumentTitle(pageTitle) {
  useEffect(() => {
    document.title = pageTitle ? `${pageTitle} — ${SITE_NAME}` : DEFAULT_TITLE;
  }, [pageTitle]);
}
