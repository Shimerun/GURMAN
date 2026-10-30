import { BadgeCheck, Handshake, Sprout, Store } from 'lucide-react';
import { IN_CITY } from '../../lib/constants';
import SectionHeader from '../ui/SectionHeader';

const BENEFITS = [
  {
    icon: Sprout,
    title: 'Свіжі продукти',
    description: 'Овочі й фрукти потрапляють на полицю протягом 24 годин після збору, хліб випікаємо щоранку.',
  },
  {
    icon: Store,
    title: 'Магазини поруч',
    description: `Чотири магазини ${IN_CITY}, один із них працює цілодобово. Ціни на сайті й у магазинах однакові.`,
  },
  {
    icon: Handshake,
    title: 'Надійні постачальники',
    description: 'Працюємо напряму з понад 120 фермерськими господарствами та виробниками, яких перевіряємо особисто.',
  },
  {
    icon: BadgeCheck,
    title: 'Гарантія якості',
    description: 'Не сподобався товар — замінимо його або повернемо гроші без зайвих питань.',
  },
];

export default function BenefitsSection() {
  return (
    <section aria-labelledby="benefits-heading">
      <SectionHeader id="benefits-heading" eyebrow="Чому GURMAN" title="Купувати у нас — просто й надійно" />
      <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {BENEFITS.map(({ icon: Icon, title, description }) => (
          <li
            key={title}
            className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100 transition-shadow duration-200 hover:shadow-lg sm:p-6"
          >
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
              <Icon className="h-6 w-6" aria-hidden="true" />
            </span>
            <h3 className="mt-4 text-lg font-bold text-slate-900">{title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
