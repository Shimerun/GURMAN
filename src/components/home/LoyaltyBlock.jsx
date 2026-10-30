import { Cake, Gift, Info, Percent, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { SECTION_IDS } from '../../lib/constants';
import BrandMark from '../ui/BrandMark';

const BENEFITS = [
  { icon: Percent, title: 'Персональні знижки', description: 'Щотижневі пропозиції на товари, які ви купуєте найчастіше.' },
  { icon: Gift, title: 'Бонуси за покупки', description: '1 бонус за кожні ₴ 20 — оплачуйте бонусами до 50% чека.' },
  { icon: Sparkles, title: 'Ранній доступ', description: 'Сезонні розпродажі для власників картки на день раніше.' },
  { icon: Cake, title: 'Подарунок до дня народження', description: 'Подвійні бонуси протягом тижня святкування.' },
];

const showCardComingSoon = () =>
  toast('Онлайн-оформлення картки скоро запрацює. Поки що картку можна отримати на касі будь-якого магазину.', {
    icon: <Info className="h-5 w-5 shrink-0 text-sky-600" aria-hidden="true" />,
    duration: 4000,
  });

export default function LoyaltyBlock() {
  return (
    <section
      id={SECTION_IDS.loyalty}
      aria-labelledby="loyalty-heading"
      className="overflow-hidden rounded-3xl bg-emerald-900 text-white shadow-soft"
    >
      <div className="grid items-center gap-10 p-6 sm:p-10 lg:grid-cols-[1.2fr_1fr] lg:p-14">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">Програма лояльності</p>
          <h2 id="loyalty-heading" className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Картка GURMAN
          </h2>
          <p className="mt-3 max-w-lg text-white/70">Одна картка — і кожна покупка працює на вас. Без щорічних внесків і складних умов.</p>

          <ul className="mt-8 grid gap-5 sm:grid-cols-2">
            {BENEFITS.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 text-amber-300">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-semibold">{title}</p>
                  <p className="mt-0.5 text-sm text-white/60">{description}</p>
                </div>
              </li>
            ))}
          </ul>

          {/* aria-disabled keeps the button focusable so keyboard users can still learn why it's unavailable. */}
          <button
            type="button"
            aria-disabled="true"
            onClick={showCardComingSoon}
            className="mt-8 cursor-not-allowed rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-white/60 ring-1 ring-white/20 transition-colors hover:bg-white/15"
          >
            Отримати картку
          </button>
        </div>

        <div className="mx-auto w-full max-w-sm" aria-hidden="true">
          <div className="relative aspect-[1.586] rotate-[-4deg] overflow-hidden rounded-3xl bg-amber-400 p-6 text-emerald-900 shadow-2xl motion-reduce:rotate-0">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/20" />
            <div className="relative flex h-full flex-col justify-between">
              <p className="flex items-center gap-2 font-display text-xl font-bold tracking-tight">
                <BrandMark className="h-10 w-10" />
                GURMAN
              </p>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-emerald-900/80">Бонусний рахунок</p>
                <p className="font-display text-3xl font-bold tabular-nums">1 250</p>
              </div>
              <p className="font-mono text-sm tracking-[0.3em] text-emerald-900/80">•••• •••• 2048</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
