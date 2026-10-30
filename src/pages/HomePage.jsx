import AppBanner from '../components/home/AppBanner';
import BenefitsSection from '../components/home/BenefitsSection';
import CategoryCards from '../components/home/CategoryCards';
import ContactCta from '../components/home/ContactCta';
import CustomerReviews from '../components/home/CustomerReviews';
import HeroBanner from '../components/home/HeroBanner';
import LoyaltyBlock from '../components/home/LoyaltyBlock';
import PopularProducts from '../components/home/PopularProducts';
import SeasonalOffers from '../components/home/SeasonalOffers';
import WeeklyDeals from '../components/home/WeeklyDeals';
import InstallBanner from '../components/mobile/InstallBanner';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function HomePage() {
  useDocumentTitle(undefined);

  return (
    <div className="space-y-12 sm:space-y-16">
      <HeroBanner />
      <InstallBanner />
      <BenefitsSection />
      <CategoryCards />
      <PopularProducts />
      <SeasonalOffers />
      <WeeklyDeals />
      <CustomerReviews />
      <LoyaltyBlock />
      <AppBanner />
      <ContactCta />
    </div>
  );
}
