import { ArrowRight, Clock, LayoutGrid, MapPin, Sprout, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CITY, PROMO_LISTING_QUERY, STORE_CONTACTS } from '../../lib/constants';
import { buttonClassName } from '../../lib/buttonStyles';
import { ROUTES, getCatalogPath } from '../../lib/routes';
import SafeImage from '../ui/SafeImage';
import HeroDeals from './HeroDeals';

const HERO_FACTS = [
  { icon: Clock, label: STORE_CONTACTS.storeHours },
  { icon: Sprout, label: 'Свіжий хліб щоранку' },
];

export default function HeroBanner() {
  return (
    <section aria-labelledby="hero-heading" className="grid gap-4 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:gap-5">
      <div className="relative isolate flex overflow-hidden rounded-3xl bg-emerald-950 text-white shadow-soft">
        <SafeImage
          src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1400&q=70&auto=format"
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

        <div className="flex flex-col justify-center p-6 sm:p-10 lg:max-w-2xl lg:p-12">
          <p className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white ring-1 ring-white/25 sm:text-sm">
            <MapPin className="h-4 w-4 text-amber-300" aria-hidden="true" />
            {CITY} · 2 магазини
          </p>
          <p className="mt-5 -rotate-2 font-script text-3xl font-semibold leading-none text-amber-300" aria-hidden="true">
            смачно щодня
          </p>
          <h1 id="hero-heading" className="mt-2 font-display text-[1.75rem] font-bold leading-[1.15] tracking-tight sm:text-4xl">
            Свіжі продукти щодня — у магазинах поруч із домом
          </h1>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-emerald-50 sm:text-lg">
            Фермерські овочі, хліб із власної пекарні та знижки тижня. Обирайте товари на сайті — купуйте в найближчому магазині GURMAN.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link to={getCatalogPath(PROMO_LISTING_QUERY)} className={buttonClassName({ variant: 'accent', size: 'lg' })}>
              <Tag className="h-5 w-5" aria-hidden="true" />
              Акції тижня
            </Link>
            <Link to={ROUTES.catalog} className={buttonClassName({ variant: 'onDark', size: 'lg' })}>
              <LayoutGrid className="h-5 w-5" aria-hidden="true" />
              Перейти до каталогу
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
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
