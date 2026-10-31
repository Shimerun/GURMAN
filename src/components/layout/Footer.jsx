import { Clock, CreditCard, Mail, MapPin, Phone, Store } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BRAND_NAME, IS_DEMO_CONTENT, LEGAL_ENTITY } from '../../config/business';
import { useCategories } from '../../hooks/useProducts';
import { IN_CITY, NAV_LINKS, PAYMENT_METHODS, PROMO_LISTING_QUERY, STORE_CONTACTS } from '../../lib/constants';
import { ROUTES, getCatalogPath, getCategoryPath } from '../../lib/routes';
import BrandLogo from '../ui/BrandLogo';
import SocialLinks from '../ui/SocialLinks';

const CUSTOMER_LINKS = [...NAV_LINKS, { label: 'Акції тижня', to: getCatalogPath(PROMO_LISTING_QUERY) }, { label: 'Кошик', to: ROUTES.cart }];

const CURRENT_YEAR = new Date().getFullYear();

// Demo builds say so; a live site names the seller instead (consumer-protection requirement).
const OWNERSHIP_NOTE = IS_DEMO_CONTENT
  ? 'Вигаданий бренд для демонстрації, не пов’язаний із реальними мережами.'
  : LEGAL_ENTITY && `${LEGAL_ENTITY.name}, код ${LEGAL_ENTITY.taxId}.`;

const LINK_CLASS_NAME = 'inline-flex min-h-8 items-center text-sm text-slate-300 transition-colors hover:text-white hover:underline underline-offset-4';

/** @param {{ title: string, children: import('react').ReactNode }} props */
function FooterColumn({ title, children }) {
  return (
    <div>
      <h2 className="text-sm font-semibold uppercase tracking-wider text-white">{title}</h2>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function FooterCategories() {
  const { data: categories, isLoading } = useCategories();

  if (isLoading) {
    return (
      <div className="space-y-3" aria-busy="true" aria-label="Завантаження категорій">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="h-3.5 w-32 animate-pulse rounded bg-white/10 motion-reduce:animate-none" />
        ))}
      </div>
    );
  }

  return (
    <ul className="space-y-0.5">
      {categories.map((category) => (
        <li key={category.id}>
          <Link to={getCategoryPath(category.id)} className={LINK_CLASS_NAME}>
            {category.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function Footer() {
  return (
    <footer className="mt-16 bg-emerald-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_repeat(4,minmax(0,1fr))]">
          <div className="sm:col-span-2 lg:col-span-1">
            <BrandLogo tone="dark" showTagline showSubtitle />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
              Супермаркет свіжих продуктів {IN_CITY}: фермерські овочі, власна пекарня та чесні ціни щодня.
            </p>
            <SocialLinks className="mt-5" />
          </div>

          <nav aria-label="Покупцям">
            <FooterColumn title="Покупцям">
              <ul className="space-y-0.5">
                {CUSTOMER_LINKS.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className={LINK_CLASS_NAME}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </FooterColumn>
          </nav>

          <nav aria-label="Категорії товарів">
            <FooterColumn title="Категорії">
              <FooterCategories />
            </FooterColumn>
          </nav>

          <FooterColumn title="Контакти">
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Phone className="mt-1 h-4 w-4 shrink-0 text-amber-300" aria-hidden="true" />
                <span>
                  <a href={STORE_CONTACTS.phoneHref} className="inline-flex min-h-6 items-center font-semibold text-white transition-colors hover:text-amber-200">
                    {STORE_CONTACTS.phone}
                  </a>
                  <span className="block text-xs text-slate-400">Безкоштовно з усіх номерів України</span>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="mt-1 h-4 w-4 shrink-0 text-amber-300" aria-hidden="true" />
                <a href={STORE_CONTACTS.emailHref} className="break-all transition-colors hover:text-white">
                  {STORE_CONTACTS.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-1 h-4 w-4 shrink-0 text-amber-300" aria-hidden="true" />
                {STORE_CONTACTS.address}
              </li>
              <li className="flex items-start gap-2">
                <Clock className="mt-1 h-4 w-4 shrink-0 text-amber-300" aria-hidden="true" />
                <span>{STORE_CONTACTS.storeHours}</span>
              </li>
            </ul>
          </FooterColumn>

          <FooterColumn title="Як купити">
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Store className="mt-1 h-4 w-4 shrink-0 text-amber-300" aria-hidden="true" />
                <span>Обирайте товари онлайн і купуйте в магазинах GURMAN {IN_CITY}.</span>
              </li>
              <li className="flex items-start gap-2">
                <CreditCard className="mt-1 h-4 w-4 shrink-0 text-amber-300" aria-hidden="true" />
                <span>
                  Оплата на касі: <span className="text-slate-400">{PAYMENT_METHODS.join(', ').toLowerCase()}</span>
                </span>
              </li>
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                to={ROUTES.contacts}
                className="inline-flex min-h-11 items-center rounded-full bg-amber-400 px-4 text-sm font-semibold text-slate-900 transition-colors hover:bg-amber-300"
              >
                Адреси магазинів
              </Link>
              <Link
                to={ROUTES.delivery}
                className="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold text-white ring-1 ring-white/30 transition-colors hover:bg-white/10"
              >
                Як купити
              </Link>
            </div>
          </FooterColumn>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/15 pt-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {CURRENT_YEAR} {BRAND_NAME}. {OWNERSHIP_NOTE}
          </p>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>Ціни на сайті такі ж, як у магазинах.</span>
            <Link to={ROUTES.privacy} className="inline-flex min-h-8 items-center text-slate-300 underline underline-offset-4 transition-colors hover:text-white">
              Політика конфіденційності
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
