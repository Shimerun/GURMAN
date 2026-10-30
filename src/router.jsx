import { createBrowserRouter } from 'react-router-dom';
import SiteLayout from './components/layout/SiteLayout';
import AboutPage from './pages/AboutPage';
import CartPage from './pages/CartPage';
import CatalogPage from './pages/CatalogPage';
import CategoryPage from './pages/CategoryPage';
import ContactsPage from './pages/ContactsPage';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import ProductPage from './pages/ProductPage';
import RouteErrorPage from './pages/RouteErrorPage';

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
          { path: 'contacts', element: <ContactsPage /> },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
]);
