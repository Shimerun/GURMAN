import {
  ArrowRight,
  BadgeCheck,
  Croissant,
  HeartHandshake,
  Leaf,
  MapPin,
  Milk,
  RotateCcw,
  Scale,
  ShieldCheck,
  Sprout,
  Target,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/ui/PageHeader';
import SafeImage from '../components/ui/SafeImage';
import SectionHeader from '../components/ui/SectionHeader';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { buttonClassName } from '../lib/buttonStyles';
import { IN_CITY } from '../lib/constants';
import { ROUTES } from '../lib/routes';
import { cn } from '../lib/utils';

const STATS = [
  { value: '2014', label: 'рік відкриття першого магазину' },
  { value: '2', label: `магазини ${IN_CITY}` },
  { value: '120+', label: 'фермерів і виробників-партнерів' },
  { value: '7:00–22:00', label: 'щодня, без вихідних' },
];

const VALUES = [
  {
    icon: Leaf,
    title: 'Свіжість понад усе',
    description:
      'Короткі ланцюжки постачання: від поля й ферми до полиці — менше доби. Те, що не пройшло перевірку, на вітрину не потрапляє.',
  },
  {
    icon: MapPin,
    title: 'Підтримуємо локальне',
    description:
      'Дві третини асортименту — від виробників Житомирщини та сусідніх областей. Ми допомагаємо малим фермам зростати разом з нами.',
  },
  {
    icon: Scale,
    title: 'Чесні ціни',
    description: 'Без «знижок» на завищені ціни. Акції тижня — це реальна різниця, яку ми погоджуємо з постачальниками.',
  },
  {
    icon: HeartHandshake,
    title: 'Турбота про покупців',
    description: 'Підтримка відповідає щодня, а якщо товар не сподобався — замінимо або повернемо гроші без зайвих питань.',
  },
];

const SUPPLIERS = [
  {
    icon: Sprout,
    title: 'Фермерські господарства',
    description: 'Овочі, зелень і картопля з полів Житомирщини — збираємо зранку, на полиці ввечері.',
  },
  {
    icon: Milk,
    title: 'Молочні ферми',
    description: 'Молоко, сир і вершкове масло від ферм, які ми відвідуємо особисто щонайменше двічі на рік.',
  },
  {
    icon: Croissant,
    title: 'Власна пекарня',
    description: 'Хліб на заквасці та випічку печемо самі щоранку — без покращувачів і консервантів.',
  },
];

const GUARANTEES = [
  {
    icon: BadgeCheck,
    title: 'Перевірка кожної партії',
    description: 'Товар приймаємо лише після контролю якості, температури та термінів придатності.',
  },
  {
    icon: RotateCcw,
    title: 'Заміна або повернення',
    description: 'Не сподобався продукт — поверніть чек на касі будь-якого магазину, і ми повернемо гроші.',
  },
  {
    icon: ShieldCheck,
    title: 'Прозоре маркування',
    description: 'Походження, виробник і склад вказані для кожного товару — на полиці та на сайті.',
  },
];

const MILESTONES = [
  {
    year: '2014',
    title: 'Перший магазин на Грушевського',
    description: 'Невелика крамниця з фермерськими продуктами та власною пекарнею.',
  },
  { year: '2017', title: 'Власна пекарня й кулінарія', description: 'Почали випікати хліб на заквасці та ліпити вареники щоранку.' },
  { year: '2020', title: 'Картка GURMAN', description: 'Запустили програму лояльності з бонусами та персональними знижками.' },
  { year: '2023', title: 'Другий магазин', description: 'Відкрили магазин на вулиці Гагаріна.' },
  { year: '2026', title: 'Новий сайт', description: 'Каталог із цінами, акції тижня й адреси магазинів — в одному місці.' },
];

/** @param {{ items: { icon: import('lucide-react').LucideIcon, title: string, description: string }[], columnsClassName: string }} props */
function FeatureCards({ items, columnsClassName }) {
  return (
    <ul className={cn('grid gap-4', columnsClassName)}>
      {items.map(({ icon: Icon, title, description }) => (
        <li key={title} className="flex gap-4 rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100 sm:p-6">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
            <Icon className="h-6 w-6" aria-hidden="true" />
          </span>
          <div>
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">{description}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function AboutPage() {
  useDocumentTitle('Про нас', `Історія GURMAN — мережі з двох супермаркетів свіжих продуктів ${IN_CITY}: місцеві постачальники, власна пекарня й гарантія якості.`);

  return (
    <div className="space-y-12 sm:space-y-16">
      <div>
        <PageHeader
          title="Про GURMAN"
          eyebrow="Наша історія"
          breadcrumbs={[{ label: 'Про нас' }]}
          description={`GURMAN — супермаркет свіжих продуктів ${IN_CITY}. Ми віримо, що щоденні покупки можуть бути приємними: зрозумілий асортимент, чесні ціни та якість, за яку не соромно.`}
        />

        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="space-y-4 text-base leading-relaxed text-slate-600">
            <p>
              Усе почалося з невеликої крамниці на Грушевського, де ми продавали овочі від знайомих фермерів і хліб, який пекли самі.
              Покупці поверталися не лише по продукти, а й по пораду: що приготувати на вечерю та який сир обрати до вина.
            </p>
            <p>
              Сьогодні в GURMAN два магазини {IN_CITY}, але принцип лишився той самий: ми особисто знаємо постачальників, перевіряємо
              кожну партію та не продаємо те, що не купили б для своєї родини.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link to={ROUTES.catalog} className={buttonClassName()}>
                Перейти до каталогу
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link to={ROUTES.contacts} className={buttonClassName({ variant: 'secondary' })}>
                Наші магазини
              </Link>
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl bg-emerald-50 shadow-soft ring-1 ring-slate-100">
            <SafeImage
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1000&q=70&auto=format"
              alt="Полиці зі свіжими овочами та фруктами в магазині GURMAN"
              isEager
              width={1000}
              height={667}
              className="aspect-[3/2] w-full object-cover"
            />
          </div>
        </div>
      </div>

      <section aria-labelledby="mission-heading" className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-slate-100 sm:p-10">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-amber-100 text-amber-800">
            <Target className="h-7 w-7" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Місія</p>
            <h2 id="mission-heading" className="mt-1 font-display text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Свіжа місцева їжа — щодня й за чесною ціною
            </h2>
            <p className="mt-3 max-w-3xl text-slate-600">
              Ми скорочуємо шлях продуктів від виробника до вашого столу, щоб вони зберігали смак і користь, а фермери Житомирщини мали
              стабільний збут. Кожне рішення — від асортименту до цін — перевіряємо одним питанням: чи купили б ми це для своєї родини?
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="why-heading" className="rounded-3xl bg-emerald-800 px-6 py-8 text-white shadow-soft sm:px-10">
        <h2 id="why-heading" className="font-display text-lg font-bold sm:text-xl">
          Чому покупці обирають GURMAN
        </h2>
        <dl className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col-reverse">
              <dt className="mt-1 text-sm text-emerald-100">{stat.label}</dt>
              <dd className="text-4xl font-extrabold tracking-tight">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="values-heading">
        <SectionHeader id="values-heading" eyebrow="У що ми віримо" title="Принципи якості" />
        <FeatureCards items={VALUES} columnsClassName="sm:grid-cols-2" />
      </section>

      <section aria-labelledby="suppliers-heading">
        <SectionHeader
          id="suppliers-heading"
          eyebrow="Постачальники"
          title="Звідки наші продукти"
          description="Працюємо напряму з понад 120 господарствами та виробниками — без зайвих посередників."
        />
        <FeatureCards items={SUPPLIERS} columnsClassName="md:grid-cols-3" />
      </section>

      <section aria-labelledby="guarantees-heading">
        <SectionHeader id="guarantees-heading" eyebrow="Наші зобов’язання" title="Гарантії якості" />
        <FeatureCards items={GUARANTEES} columnsClassName="md:grid-cols-3" />
      </section>

      <section aria-labelledby="history-heading">
        <SectionHeader id="history-heading" eyebrow="Шлях GURMAN" title="Як ми зростали" />
        <ol className="relative space-y-6 border-l-2 border-emerald-100 pl-6 sm:pl-8">
          {MILESTONES.map((milestone) => (
            <li key={milestone.year} className="relative">
              <span
                className="absolute -left-[2.05rem] top-1 grid h-4 w-4 place-items-center rounded-full bg-emerald-600 ring-4 ring-emerald-100 sm:-left-[2.55rem]"
                aria-hidden="true"
              />
              <p className="text-sm font-bold text-emerald-700">{milestone.year}</p>
              <h3 className="mt-0.5 text-lg font-semibold text-slate-900">{milestone.title}</h3>
              <p className="mt-1 max-w-2xl text-sm text-slate-600">{milestone.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="about-cta-heading" className="rounded-3xl bg-amber-50 p-6 text-center ring-1 ring-amber-100 sm:p-10">
        <h2 id="about-cta-heading" className="font-display text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          Спробуйте самі
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-slate-600">Перегляньте каталог і акції тижня — або завітайте до найближчого магазину.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to={ROUTES.catalog} className={buttonClassName({ size: 'lg' })}>
            Перейти до каталогу
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link to={ROUTES.contacts} className={buttonClassName({ size: 'lg', variant: 'secondary' })}>
            Адреси магазинів
          </Link>
        </div>
      </section>
    </div>
  );
}
