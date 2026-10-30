import { Clock, CreditCard, Mail, MapPin, Phone, ShoppingBasket } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCategories } from '../../hooks/useProducts';
import { IN_CITY, NAV_LINKS, PAYMENT_METHODS, STORE_CONTACTS } from '../../lib/constants';
import { ROUTES, getCatalogPath, getCategoryPath } from '../../lib/routes';
import SocialLinks from '../ui/SocialLinks';

const CUSTOMER_LINKS = [
  ...NAV_LINKS,
  { label: 'Акції тижня', to: getCatalogPath({ onlyPromo: true, sort: 'discount' }) },
  { label: 'Кошик', to: ROUTES.cart },
];

const CURRENT_YEAR = new Date().getFullYear();

const LINK_CLASS_NAME = 'text-sm transition-colors hover:text-emerald-400';

/** @param {{ title: string, children: import('react').ReactNode }} props */
function FooterColumn({ title, children }) {
  return (
    <div>
      <h2 className="text-sm font-semibold uppercase tracking-wider text-white">{title}</h2>
      <div className="mt-4">{children}</div>
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
    <ul className="space-y-2.5">
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
    <footer className="mt-16 bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_repeat(4,minmax(0,1fr))]">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to={ROUTES.home} className="inline-flex items-center gap-2 rounded-xl font-extrabold text-white">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-600 text-white">
                <ShoppingBasket className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="text-lg tracking-tight">GURMAN</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
              Супермаркет свіжих продуктів {IN_CITY}: фермерські овочі, власна пекарня та чесні ціни щодня.
            </p>
            <SocialLinks className="mt-5" />
          </div>

          <nav aria-label="Покупцям">
            <FooterColumn title="Покупцям">
              <ul className="space-y-2.5">
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
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
                <span>
                  <a href={STORE_CONTACTS.phoneHref} className="font-semibold text-white transition-colors hover:text-emerald-400">
                    {STORE_CONTACTS.phone}
                  </a>
                  <span className="block text-xs text-slate-400">Безкоштовно по Україні</span>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
                <a href={STORE_CONTACTS.emailHref} className="break-all transition-colors hover:text-emerald-400">
                  {STORE_CONTACTS.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
                {STORE_CONTACTS.address}
              </li>
            </ul>
            <h3 className="mt-6 text-sm font-semibold uppercase tracking-wider text-white">Графік роботи</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
                <span>
                  Магазини: <span className="text-slate-400">{STORE_CONTACTS.storeHours}</span>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
                <span>
                  Підтримка: <span className="text-slate-400">{STORE_CONTACTS.supportHours}</span>
                </span>
              </li>
            </ul>
          </FooterColumn>

          <FooterColumn title="Магазини">
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
                Магазини GURMAN {IN_CITY}
              </li>
              <li className="flex items-start gap-2">
                <CreditCard className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
                <span>
                  Оплата на касі: <span className="text-slate-400">{PAYMENT_METHODS.join(', ').toLowerCase()}</span>
                </span>
              </li>
            </ul>
            <Link
              to={ROUTES.contacts}
              className="mt-5 inline-flex rounded-full bg-white/5 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
            >
              Адреси магазинів
            </Link>
          </FooterColumn>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {CURRENT_YEAR} GURMAN. Усі права захищені. Вигаданий бренд для демонстрації.</p>
          <p>Ціни на сайті можуть відрізнятися від цін у магазинах.</p>
        </div>
      </div>
    </footer>
  );
}
