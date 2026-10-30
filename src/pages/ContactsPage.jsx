import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import ContactForm from '../components/contacts/ContactForm';
import StoresBlock from '../components/home/StoresBlock';
import PageHeader from '../components/ui/PageHeader';
import SocialLinks from '../components/ui/SocialLinks';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { IN_CITY, STORE_CONTACTS } from '../lib/constants';

const CONTACT_CARDS = [
  { icon: Phone, title: 'Гаряча лінія', value: STORE_CONTACTS.phone, href: STORE_CONTACTS.phoneHref, note: 'Безкоштовно з усіх номерів України' },
  { icon: Mail, title: 'Електронна пошта', value: STORE_CONTACTS.email, href: STORE_CONTACTS.emailHref, note: 'Відповідаємо протягом робочого дня' },
  { icon: MapPin, title: 'Офіс', value: STORE_CONTACTS.address, note: 'Пн–Пт, 09:00–18:00' },
  { icon: Clock, title: 'Підтримка', value: STORE_CONTACTS.supportHours, note: 'Телефон і пошта' },
];

export default function ContactsPage() {
  useDocumentTitle(
    'Магазини та контакти',
    `Адреси, графік роботи й телефони двох магазинів GURMAN ${IN_CITY}, маршрут до магазину та форма зворотного зв’язку.`,
  );

  return (
    <div className="space-y-12 sm:space-y-16">
      <div>
        <PageHeader
          title="Магазини та контакти"
          eyebrow="Завжди на зв’язку"
          breadcrumbs={[{ label: 'Магазини та контакти' }]}
          description={`Два магазини GURMAN ${IN_CITY}: адреси, графік і маршрут. Питання щодо товарів чи співпраці — телефонуйте або напишіть нам.`}
        />
        <StoresBlock eyebrow="Адреси й маршрути" />
      </div>

      <section aria-labelledby="contacts-heading">
        <h2 id="contacts-heading" className="font-display text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          Зв’язатися з нами
        </h2>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CONTACT_CARDS.map(({ icon: Icon, title, value, href, note }) => (
            <li key={title} className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-3 text-sm font-medium text-slate-600">{title}</h3>
              {href ? (
                <a href={href} className="mt-0.5 inline-flex min-h-8 items-center break-all font-bold text-slate-900 transition-colors hover:text-emerald-800 hover:underline">
                  {value}
                </a>
              ) : (
                <p className="mt-0.5 font-bold text-slate-900">{value}</p>
              )}
              <p className="mt-1 text-xs text-slate-600">{note}</p>
            </li>
          ))}
        </ul>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <p className="text-sm font-medium text-slate-700">Ми в соцмережах:</p>
          <SocialLinks tone="light" />
        </div>
      </section>

      <section
        aria-labelledby="contact-form-heading"
        className="grid gap-8 rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100 sm:p-8 lg:grid-cols-[1fr_1.4fr]"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Зворотний зв’язок</p>
          <h2 id="contact-form-heading" className="mt-1 font-display text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Напишіть нам
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-700">
            Розкажіть, що сталося або що хочете запропонувати. Якщо питання стосується конкретного магазину, вкажіть його адресу — так ми
            відповімо швидше.
          </p>
        </div>
        <ContactForm />
      </section>
    </div>
  );
}
