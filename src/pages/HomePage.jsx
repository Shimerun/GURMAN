import BenefitsSection from '../components/home/BenefitsSection';
import CategoryCards from '../components/home/CategoryCards';
import ContactCta from '../components/home/ContactCta';
import HeroBanner from '../components/home/HeroBanner';
import PopularProducts from '../components/home/PopularProducts';
import StoresBlock from '../components/home/StoresBlock';
import WeeklyDeals from '../components/home/WeeklyDeals';
import InstallBanner from '../components/mobile/InstallBanner';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function HomePage() {
  useDocumentTitle(undefined);

  return (
    <div className="space-y-10 sm:space-y-14">
      <div className="space-y-4">
        <HeroBanner />
        <BenefitsSection />
        <InstallBanner />
      </div>
      <CategoryCards />
      <WeeklyDeals />
      <PopularProducts />
      <StoresBlock />
      <ContactCta />
    </div>
  );
}
