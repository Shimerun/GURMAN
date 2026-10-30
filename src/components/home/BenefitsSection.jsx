import { BadgeCheck, Handshake, Sprout, Store } from 'lucide-react';
import { IN_CITY, STORE_CONTACTS } from '../../lib/constants';

const BENEFITS = [
  { icon: Sprout, title: 'Свіжі продукти', description: 'Овочі на полиці за 24 години після збору, хліб — щоранку.' },
  { icon: Store, title: 'Два магазини поруч', description: `Обидва ${IN_CITY}, ${STORE_CONTACTS.storeHours.toLowerCase()}. Ціни як на сайті.` },
  { icon: Handshake, title: 'Надійні постачальники', description: 'Понад 120 фермерів і виробників, яких перевіряємо особисто.' },
  { icon: BadgeCheck, title: 'Гарантія якості', description: 'Не сподобався товар — замінимо або повернемо гроші.' },
];

/** Compact value strip right under the hero: four reasons, no extra scroll depth. */
export default function BenefitsSection() {
  return (
    <section aria-labelledby="benefits-heading" className="rounded-3xl bg-white shadow-soft ring-1 ring-slate-100">
      <h2 id="benefits-heading" className="sr-only">
        Чому GURMAN
      </h2>
      <ul className="grid divide-y divide-slate-100 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
        {BENEFITS.map(({ icon: Icon, title, description }) => (
          <li key={title} className="flex gap-3 p-4 sm:p-5">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h3 className="font-semibold text-slate-900">{title}</h3>
              <p className="mt-0.5 text-sm leading-snug text-slate-600">{description}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
