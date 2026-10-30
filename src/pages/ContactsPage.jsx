import { Clock, ExternalLink, Mail, MapPin, Phone } from 'lucide-react';
import ContactForm from '../components/contacts/ContactForm';
import StoresBlock from '../components/home/StoresBlock';
import PageHeader from '../components/ui/PageHeader';
import SocialLinks from '../components/ui/SocialLinks';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { buttonClassName } from '../lib/buttonStyles';
import { CITY, STORE_CONTACTS } from '../lib/constants';

const CONTACT_CARDS = [
  {
    icon: Phone,
    title: 'Гаряча лінія',
    value: STORE_CONTACTS.phone,
    href: STORE_CONTACTS.phoneHref,
    note: 'Безкоштовно з усіх номерів України',
  },
  {
    icon: Mail,
    title: 'Електронна пошта',
    value: STORE_CONTACTS.email,
    href: STORE_CONTACTS.emailHref,
    note: 'Відповідаємо протягом робочого дня',
  },
  { icon: MapPin, title: 'Головний офіс', value: STORE_CONTACTS.address, note: 'Пн–Пт, 09:00–18:00' },
  { icon: Clock, title: 'Графік магазинів', value: STORE_CONTACTS.storeHours, note: `Підтримка: ${STORE_CONTACTS.supportHours}` },
];

const MAP_SEARCH_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(STORE_CONTACTS.address)}`;

/** No map provider is integrated, so this is a styled stand-in with a real link out to Google Maps. */
function MapSection() {
  return (
    <section aria-labelledby="map-heading" className="relative overflow-hidden rounded-3xl bg-emerald-50 ring-1 ring-emerald-100">
      {/* Decorative street grid. */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,theme(colors.emerald.100)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.emerald.100)_1px,transparent_1px)] bg-[size:48px_48px]"
        aria-hidden="true"
      />
      <div className="relative flex min-h-64 flex-col items-center justify-center gap-4 px-6 py-12 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-emerald-600 text-white shadow-lg">
          <MapPin className="h-7 w-7" aria-hidden="true" />
        </span>
        <div>
          <h2 id="map-heading" className="text-xl font-bold text-slate-900">
            GURMAN на карті міста {CITY}
          </h2>
          <p className="mt-1 text-sm text-slate-600">{STORE_CONTACTS.address}</p>
        </div>
        <a href={MAP_SEARCH_URL} target="_blank" rel="noopener noreferrer" className={buttonClassName({ variant: 'secondary' })}>
          Відкрити в Google Maps
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">(відкриється в новій вкладці)</span>
        </a>
      </div>
    </section>
  );
}

export default function ContactsPage() {
  useDocumentTitle('Контакти');

  return (
    <div className="space-y-12 sm:space-y-16">
      <div>
        <PageHeader
          title="Контакти"
          eyebrow="Завжди на зв’язку"
          breadcrumbs={[{ label: 'Контакти' }]}
          description="Питання щодо товарів, якості чи співпраці — напишіть або зателефонуйте, і ми допоможемо."
        />

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CONTACT_CARDS.map(({ icon: Icon, title, value, href, note }) => (
            <li key={title} className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="mt-3 text-sm font-medium text-slate-500">{title}</h2>
              {href ? (
                <a href={href} className="mt-0.5 block break-words font-semibold text-slate-900 transition-colors hover:text-emerald-700">
                  {value}
                </a>
              ) : (
                <p className="mt-0.5 font-semibold text-slate-900">{value}</p>
              )}
              <p className="mt-1 text-xs text-slate-500">{note}</p>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <p className="text-sm font-medium text-slate-600">Ми в соцмережах:</p>
          <SocialLinks tone="light" />
        </div>
      </div>

      <section
        aria-labelledby="contact-form-heading"
        className="grid gap-8 rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100 sm:p-8 lg:grid-cols-[1fr_1.4fr]"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Зворотний зв’язок</p>
          <h2 id="contact-form-heading" className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Напишіть нам
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Розкажіть, що сталося або що хочете запропонувати. Якщо питання стосується конкретного магазину, вкажіть його адресу — так ми
            відповімо швидше.
          </p>
        </div>
        <ContactForm />
      </section>

      <MapSection />

      <StoresBlock />
    </div>
  );
}
