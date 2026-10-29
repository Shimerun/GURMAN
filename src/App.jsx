import { useCallback } from 'react';
import { Toaster } from 'react-hot-toast';
import CartDrawer from './components/cart/CartDrawer';
import AppBanner from './components/home/AppBanner';
import CategoryGrid from './components/home/CategoryGrid';
import HeroBanner from './components/home/HeroBanner';
import LoyaltyBlock from './components/home/LoyaltyBlock';
import StoresBlock from './components/home/StoresBlock';
import WeeklyDeals from './components/home/WeeklyDeals';
import Footer from './components/layout/Footer';
import Navbar from './components/layout/Navbar';
import TopStrip from './components/layout/TopStrip';
import MobileApp from './components/mobile/MobileApp';
import Catalog from './components/products/Catalog';
import SectionHeader from './components/ui/SectionHeader';
import { useCatalogFilters } from './hooks/useCatalogFilters';
import { useIsMobile } from './hooks/useIsMobile';
import { useCategories } from './hooks/useProducts';
import { SECTION_IDS } from './lib/constants';
import { TOAST_OPTIONS } from './lib/toastOptions';
import { scrollToSection } from './lib/utils';

function DesktopApp() {
  const { data: categories, isLoading: isCategoriesLoading } = useCategories();
  const catalogFilters = useCatalogFilters();
  const { selectedCategory, setSelectedCategory, searchQuery, setSearchQuery, updateFilter } = catalogFilters;

  const showCategoryInCatalog = useCallback(
    (categoryId) => {
      setSelectedCategory(categoryId);
      scrollToSection(SECTION_IDS.catalog);
    },
    [setSelectedCategory],
  );

  const showAllPromosInCatalog = useCallback(() => {
    setSelectedCategory(null);
    updateFilter('onlyPromo', true);
    scrollToSection(SECTION_IDS.catalog);
  }, [setSelectedCategory, updateFilter]);

  return (
    <div id="top" className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:shadow-lg"
      >
        Перейти до основного вмісту
      </a>

      <TopStrip />
      <Navbar
        categories={categories}
        isCategoriesLoading={isCategoriesLoading}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectCategory={showCategoryInCatalog}
        onShowPromos={showAllPromosInCatalog}
      />

      <main id="main" className="mx-auto w-full max-w-7xl flex-1 space-y-12 px-4 py-6 sm:space-y-16 sm:px-6 sm:py-8 lg:px-8">
        <HeroBanner onSelectCategory={showCategoryInCatalog} />

        <section aria-labelledby="categories-heading">
          <SectionHeader id="categories-heading" title="Категорії" />
          <CategoryGrid
            categories={categories}
            isLoading={isCategoriesLoading}
            selectedCategory={selectedCategory}
            onSelectCategory={showCategoryInCatalog}
          />
        </section>

        <WeeklyDeals onShowAll={showAllPromosInCatalog} />
        <Catalog categories={categories} isCategoriesLoading={isCategoriesLoading} catalogFilters={catalogFilters} />
        <LoyaltyBlock />
        <StoresBlock />
        <AppBanner />
      </main>

      <Footer />
      <CartDrawer />
      <Toaster position="bottom-center" toastOptions={TOAST_OPTIONS} />
    </div>
  );
}

// Separate trees keep each layout's hooks and state isolated; the cart store is shared and persisted.
export default function App() {
  const isMobile = useIsMobile();
  return isMobile ? <MobileApp /> : <DesktopApp />;
}
