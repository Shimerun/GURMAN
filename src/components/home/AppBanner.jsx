import { Check, ShoppingBasket, Smartphone } from 'lucide-react';
import toast from 'react-hot-toast';
import { SECTION_IDS } from '../../lib/constants';

const FEATURES = ['Персональні акції щодня', 'Списки покупок і повторне замовлення', 'Наявність товарів у найближчому магазині'];

const PLATFORMS = [
  { id: 'ios', caption: 'Завантажити для', label: 'iOS' },
  { id: 'android', caption: 'Завантажити для', label: 'Android' },
];

const showAppComingSoon = () => toast('Застосунок GURMAN зовсім скоро з’явиться в магазинах застосунків.', { icon: '📱' });

export default function AppBanner() {
  return (
    <section
      id={SECTION_IDS.app}
      aria-labelledby="app-heading"
      className="overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-amber-50 ring-1 ring-emerald-100"
    >
      <div className="grid items-center gap-10 p-6 sm:p-10 md:grid-cols-[1fr_auto] lg:px-14">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Застосунок</p>
          <h2 id="app-heading" className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Продукти в кілька дотиків
          </h2>
          <p className="mt-3 max-w-lg text-slate-600">Замовляйте з дому чи дороги, а картка GURMAN завжди буде під рукою.</p>

          <ul className="mt-6 space-y-2">
            {FEATURES.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm text-slate-700">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-600 text-white">
                  <Check className="h-3 w-3" aria-hidden="true" />
                </span>
                {feature}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            {PLATFORMS.map((platform) => (
              <button
                key={platform.id}
                type="button"
                onClick={showAppComingSoon}
                className="flex items-center gap-3 rounded-2xl bg-slate-900 px-5 py-3 text-left text-white transition-colors hover:bg-slate-700"
              >
                <Smartphone className="h-6 w-6" aria-hidden="true" />
                <span>
                  <span className="block text-[11px] leading-tight text-white/60">{platform.caption}</span>
                  <span className="block text-sm font-semibold leading-tight">{platform.label}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div
          className="mx-auto hidden h-80 w-44 rounded-[2.25rem] border-[6px] border-slate-900 bg-white p-3 shadow-2xl md:block"
          aria-hidden="true"
        >
          <div className="mx-auto h-1.5 w-12 rounded-full bg-slate-200" />
          <div className="mt-4 flex items-center gap-1.5 text-sm font-extrabold text-slate-900">
            <span className="grid h-6 w-6 place-items-center rounded-lg bg-emerald-600 text-white">
              <ShoppingBasket className="h-3.5 w-3.5" />
            </span>
            GURMAN
          </div>
          <div className="mt-3 h-16 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700" />
          <div className="mt-3 grid grid-cols-2 gap-2">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="space-y-1">
                <div className="aspect-square rounded-lg bg-emerald-50" />
                <div className="h-1.5 w-3/4 rounded-full bg-slate-200" />
                <div className="h-1.5 w-1/2 rounded-full bg-amber-300" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
