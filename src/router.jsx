import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import SiteLayout from './components/layout/SiteLayout';
import { loadProductPage } from './lib/pageLoaders';
import HomePage from './pages/HomePage';
import RouteErrorPage from './pages/RouteErrorPage';

// Home ships in the entry chunk (most visits start there); every other page loads on demand.
const AboutPage = lazy(() => import('./pages/AboutPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CatalogPage = lazy(() => import('./pages/CatalogPage'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const ContactsPage = lazy(() => import('./pages/ContactsPage'));
const DeliveryPage = lazy(() => import('./pages/DeliveryPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const ProductPage = lazy(loadProductPage);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <SiteLayout />,
    children: [
      {
        // Pathless wrapper: a page crash renders inside the layout, so header/cart keep working.
        errorElement: <RouteErrorPage />,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'catalog', element: <CatalogPage /> },
          { path: 'category/:categoryId', element: <CategoryPage /> },
          { path: 'product/:productId', element: <ProductPage /> },
          { path: 'cart', element: <CartPage /> },
          { path: 'about', element: <AboutPage /> },
          { path: 'delivery', element: <DeliveryPage /> },
          { path: 'contacts', element: <ContactsPage /> },
          { path: 'privacy', element: <PrivacyPage /> },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
]);
