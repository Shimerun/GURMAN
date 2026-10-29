import { useCallback, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useCatalogFilters } from '../../hooks/useCatalogFilters';
import { useCategories } from '../../hooks/useProducts';
import { TOAST_OPTIONS } from '../../lib/toastOptions';
import { useUIStore } from '../../store/useUIStore';
import BottomNav from './BottomNav';
import MobileHeader from './MobileHeader';
import CartScreen from './screens/CartScreen';
import CatalogScreen from './screens/CatalogScreen';
import HomeScreen from './screens/HomeScreen';
import PromoScreen from './screens/PromoScreen';
import StoresScreen from './screens/StoresScreen';
import CitySheet from './sheets/CitySheet';
import ProductSheet from './sheets/ProductSheet';

export default function MobileApp() {
  const activeTab = useUIStore((state) => state.activeTab);
  const activeSheet = useUIStore((state) => state.activeSheet);
  const selectedProductId = useUIStore((state) => state.selectedProductId);
  const setTab = useUIStore((state) => state.setTab);
  const handleHistoryBack = useUIStore((state) => state.handleHistoryBack);

  const { data: categories, isLoading: isCategoriesLoading } = useCategories();
  const catalogFilters = useCatalogFilters();
  const { setSelectedCategory } = catalogFilters;

  useEffect(() => {
    window.addEventListener('popstate', handleHistoryBack);
    return () => window.removeEventListener('popstate', handleHistoryBack);
  }, [handleHistoryBack]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [activeTab]);

  const showCategory = useCallback(
    (categoryId) => {
      setSelectedCategory(categoryId);
      setTab('catalog');
    },
    [setSelectedCategory, setTab],
  );

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen categories={categories} isCategoriesLoading={isCategoriesLoading} onSelectCategory={showCategory} />;
      case 'catalog':
        return <CatalogScreen categories={categories} isCategoriesLoading={isCategoriesLoading} catalogFilters={catalogFilters} />;
      case 'promo':
        return <PromoScreen />;
      case 'cart':
        return <CartScreen />;
      case 'stores':
        return <StoresScreen />;
      default:
        throw new Error(`MobileApp: unknown tab "${activeTab}". Expected home | catalog | promo | cart | stores.`);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-gray-50 text-slate-800">
      <MobileHeader searchQuery={catalogFilters.searchQuery} onSearchChange={catalogFilters.setSearchQuery} />

      {/* Bottom padding clears the fixed nav (3.5rem) plus the home-indicator inset. */}
      <main id="main" className="pb-[calc(3.5rem+env(safe-area-inset-bottom)+1.5rem)]">
        {renderScreen()}
      </main>

      <BottomNav />

      {activeSheet === 'product' && selectedProductId && <ProductSheet key={selectedProductId} productId={selectedProductId} />}
      {activeSheet === 'city' && <CitySheet />}

      {/* Top position keeps toasts clear of the bottom nav and sticky cart bar. */}
      <Toaster
        position="top-center"
        toastOptions={TOAST_OPTIONS}
        containerClassName="!top-[calc(env(safe-area-inset-top)+0.75rem)]"
      />
    </div>
  );
}
