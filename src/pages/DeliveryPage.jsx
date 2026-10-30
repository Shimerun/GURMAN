import { ChevronDown, CreditCard, ListChecks, MapPin, RotateCcw, Store } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import SectionHeader from '../components/ui/SectionHeader';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { IN_CITY, PAYMENT_METHODS, STORE_CONTACTS } from '../lib/constants';

const STEPS = [
  {
    icon: ListChecks,
    title: 'Оберіть товари на сайті',
    description: 'Порівняйте ціни й акції тижня, додайте потрібне в кошик — він працює як список покупок і зберігається на цьому пристрої.',
  },
  {
    icon: MapPin,
    title: 'Прийдіть у найближчий магазин',
    description: `Два магазини ${IN_CITY}: на вулиці Михайла Грушевського та на вулиці Гагаріна. ${STORE_CONTACTS.storeHours}.`,
  },
  {
    icon: CreditCard,
    title: 'Оплатіть на касі',
    description: 'Ціни в магазині такі самі, як на сайті. Знижки тижня діють автоматично, бонуси картки GURMAN — за бажанням.',
  },
];

const FAQ = [
  {
    question: 'Ви працюєте в інших містах?',
    answer: `Поки що ні: обидва магазини GURMAN розташовані ${IN_CITY}.`,
  },
  {
    question: 'Чи можна відкласти товар до мого приходу?',
    answer: `Резерву поки немає. Наявність конкретного товару в магазині підкажуть за телефоном ${STORE_CONTACTS.phone}.`,
  },
  {
    question: 'Ціни на сайті й у магазині однакові?',
    answer: 'Так. Ціни та акції тижня на сайті відповідають цінам на полицях усіх магазинів GURMAN.',
  },
];

export default function DeliveryPage() {
  useDocumentTitle(
    'Як купити: оплата й повернення',
    `Обирайте товари на сайті й купуйте в магазинах GURMAN ${IN_CITY}. Способи оплати, повернення та відповіді на питання.`,
  );

  return (
    <div className="space-y-12 sm:space-y-16">
      <div>
        <PageHeader
          title="Як купити в GURMAN"
          eyebrow="Покупки й оплата"
          breadcrumbs={[{ label: 'Як купити' }]}
          description={`Ми працюємо лише ${IN_CITY}. Сайт допомагає обрати товари й порівняти ціни, а купуєте ви — у магазині поруч.`}
        />
      </div>

      <section aria-labelledby="steps-heading">
        <SectionHeader id="steps-heading" eyebrow="Три кроки" title="Як це працює" />
        <ol className="grid gap-4 md:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, description }, index) => (
            <li key={title} className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100 sm:p-6">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-700 text-sm font-bold text-white" aria-hidden="true">
                  {index + 1}
                </span>
                <Icon className="h-6 w-6 text-emerald-700" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-900">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-700">{description}</p>
            </li>
          ))}
        </ol>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section aria-labelledby="payment-heading" className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100 sm:p-6">
          <h2 id="payment-heading" className="flex items-center gap-2 text-xl font-bold text-slate-900">
            <CreditCard className="h-5 w-5 text-emerald-700" aria-hidden="true" />
            Оплата на касі
          </h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {PAYMENT_METHODS.map((method) => (
              <li key={method} className="rounded-xl bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-800 ring-1 ring-slate-100">
                {method}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="returns-heading" className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100 sm:p-6">
          <h2 id="returns-heading" className="flex items-center gap-2 text-xl font-bold text-slate-900">
            <RotateCcw className="h-5 w-5 text-emerald-700" aria-hidden="true" />
            Повернення та заміна
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-700">
            Не сподобався продукт або виявився неякісним — принесіть чек на касу будь-якого магазину GURMAN {IN_CITY}. Замінимо товар або
            повернемо гроші.
          </p>
          <p className="mt-3 flex items-center gap-2 text-sm text-slate-700">
            <Store className="h-4 w-4 shrink-0 text-emerald-700" aria-hidden="true" />
            Питання — за телефоном{' '}
            <a href={STORE_CONTACTS.phoneHref} className="font-semibold text-emerald-800 underline underline-offset-2">
              {STORE_CONTACTS.phone}
            </a>
          </p>
        </section>
      </div>

      <section aria-labelledby="faq-heading">
        <SectionHeader id="faq-heading" eyebrow="Питання та відповіді" title="Часті запитання" />
        <div className="space-y-3">
          {FAQ.map((item) => (
            <details key={item.question} className="group rounded-2xl bg-white shadow-soft ring-1 ring-slate-100 open:ring-emerald-200">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-5 py-3 font-semibold text-slate-900 transition-colors hover:text-emerald-800 [&::-webkit-details-marker]:hidden">
                {item.question}
                <ChevronDown className="h-5 w-5 shrink-0 text-slate-500 transition-transform duration-200 group-open:rotate-180" aria-hidden="true" />
              </summary>
              <p className="px-5 pb-5 text-sm leading-relaxed text-slate-700">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
