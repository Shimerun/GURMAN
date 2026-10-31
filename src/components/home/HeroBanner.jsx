import { ArrowRight, Clock, Sprout } from 'lucide-react';
import { Link } from 'react-router-dom';
import { STORE_PHOTO_URL } from '../../config/business';
import { CITY, PROMO_LISTING_QUERY, STORE_CONTACTS } from '../../lib/constants';
import { IMAGE_SIZES } from '../../lib/imageSizes';
import { buttonClassName } from '../../lib/buttonStyles';
import { ROUTES, getCatalogPath } from '../../lib/routes';
import BrandIcon from '../ui/BrandIcon';
import SafeImage from '../ui/SafeImage';
import HeroDeals from './HeroDeals';
import SeasonalParticles from './SeasonalParticles';

// size 'sm' on phones (two buttons share a row), the 'lg' look from `sm` up.
const HERO_BUTTON_CLASS_NAME = 'sm:h-12 sm:px-6 sm:text-base';

const HERO_FACTS = [
  { icon: Clock, label: STORE_CONTACTS.storeHours },
  { icon: Sprout, label: 'Свіжий хліб щоранку' },
];

export default function HeroBanner() {
  return (
    <section aria-labelledby="hero-heading" className="grid gap-4 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:gap-5">
      <div className="relative isolate flex overflow-hidden rounded-xl bg-emerald-950 text-white shadow-soft">
        <SafeImage
          src={STORE_PHOTO_URL}
          sizes={IMAGE_SIZES.hero}
          alt=""
          isEager
          fetchpriority="high"
          width={1400}
          height={933}
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
        {/* Solid scrim on phones (text spans the full width); on desktop the photo shows through on the right only. */}
        <div
          className="absolute inset-0 -z-10 bg-emerald-950/85 lg:bg-transparent lg:bg-gradient-to-r lg:from-emerald-950 lg:via-emerald-950/90 lg:to-emerald-950/25"
          aria-hidden="true"
        />
        <SeasonalParticles />

        {/* Phones get a compact banner (no badge or lead, smaller title, buttons in one row) so the
            weekly deals below are on the first screen too, as on desktop. */}
        <div className="flex flex-col justify-center p-5 sm:p-10 lg:max-w-2xl lg:p-12">
          <p className="hidden w-fit items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-white ring-1 ring-white/25 sm:inline-flex sm:text-sm">
            <BrandIcon name="pin" className="h-4 w-4 text-gray-50" />
            {CITY} · 2 магазини
          </p>
          <p className="-rotate-2 font-script text-2xl font-semibold leading-none text-amber-300 sm:mt-5 sm:text-3xl" aria-hidden="true">
            смачно щодня
          </p>
          <h1 id="hero-heading" className="mt-1.5 font-display text-[1.375rem] font-bold leading-[1.2] tracking-tight sm:mt-2 sm:text-4xl sm:leading-[1.15]">
            Свіжі продукти щодня — у магазинах поруч із домом
          </h1>
          <p className="mt-4 hidden max-w-lg text-lg leading-relaxed text-emerald-50 sm:block">
            Фермерські овочі, хліб із власної пекарні та знижки тижня. Обирайте товари на сайті — купуйте в найближчому магазині GURMAN.
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-7 sm:flex sm:flex-wrap sm:gap-3">
            <Link to={getCatalogPath(PROMO_LISTING_QUERY)} className={buttonClassName({ variant: 'accent', size: 'sm', className: HERO_BUTTON_CLASS_NAME })}>
              <BrandIcon name="tag" className="h-4 w-4 sm:h-5 sm:w-5" />
              Акції тижня
            </Link>
            <Link to={ROUTES.catalog} className={buttonClassName({ variant: 'onDark', size: 'sm', className: HERO_BUTTON_CLASS_NAME })}>
              <BrandIcon name="catalog" className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="sm:hidden">Каталог</span>
              <span className="hidden sm:inline">Перейти до каталогу</span>
              <ArrowRight className="hidden h-4 w-4 sm:block" aria-hidden="true" />
            </Link>
          </div>

          <ul className="mt-8 hidden flex-wrap gap-x-5 gap-y-2 text-sm text-emerald-50 sm:flex">
            {HERO_FACTS.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-1.5">
                <Icon className="h-4 w-4 shrink-0 text-amber-300" aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <HeroDeals />
    </section>
  );
}
