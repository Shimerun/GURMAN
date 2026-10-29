import { Camera, Clock, Mail, MessageCircle, Phone, Send, ShoppingBasket, Video } from 'lucide-react';
import { SECTION_IDS } from '../../lib/constants';

const FOOTER_COLUMNS = [
  {
    title: 'Покупцям',
    links: [
      { label: 'Акції тижня', href: `#${SECTION_IDS.promo}` },
      { label: 'Каталог', href: `#${SECTION_IDS.catalog}` },
      { label: 'Картка GURMAN', href: `#${SECTION_IDS.loyalty}` },
      { label: 'Застосунок', href: `#${SECTION_IDS.app}` },
    ],
  },
  {
    title: 'Компанія',
    links: [
      { label: 'Про нас', href: '#' },
      { label: 'Наші магазини', href: `#${SECTION_IDS.stores}` },
      { label: 'Вакансії', href: '#' },
      { label: 'Постачальникам', href: '#' },
    ],
  },
  {
    title: 'Допомога',
    links: [
      { label: 'Доставка та оплата', href: '#' },
      { label: 'Повернення товару', href: '#' },
      { label: 'Питання та відповіді', href: '#' },
      { label: 'Політика конфіденційності', href: '#' },
    ],
  },
];

const SOCIAL_LINKS = [
  { label: 'GURMAN у Telegram', icon: Send },
  { label: 'GURMAN в Instagram', icon: Camera },
  { label: 'GURMAN на YouTube', icon: Video },
  { label: 'GURMAN у Facebook', icon: MessageCircle },
];

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="mt-16 bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {FOOTER_COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-white">{column.title}</h2>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm transition-colors hover:text-emerald-400">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white">Контакти</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                <a href="tel:0800000800" className="transition-colors hover:text-emerald-400">
                  0 800 000 800
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                <a href="mailto:hello@gurman.example" className="transition-colors hover:text-emerald-400">
                  hello@gurman.example
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                Щодня 08:00–22:00
              </li>
            </ul>
            <div className="mt-5 flex gap-2">
              {SOCIAL_LINKS.map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  type="button"
                  aria-label={label}
                  className="grid h-10 w-10 place-items-center rounded-full bg-white/5 text-slate-300 transition-colors hover:bg-emerald-600 hover:text-white"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2 font-semibold text-white">
            <ShoppingBasket className="h-5 w-5 text-emerald-400" aria-hidden="true" />
            GURMAN
          </p>
          <p>© {CURRENT_YEAR} GURMAN. Усі права захищені. Вигаданий бренд для демонстрації.</p>
        </div>
      </div>
    </footer>
  );
}
