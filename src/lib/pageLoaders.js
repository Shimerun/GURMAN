/**
 * Chunk loaders shared by the router (React.lazy) and by prefetch hints. Calling one early warms
 * the same module, so a view-transition navigation renders the page instead of its fallback.
 */
export const loadProductPage = () => import('../pages/ProductPage');
