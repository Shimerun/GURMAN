import { ArrowRight, MessageSquare, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { buttonClassName } from '../../lib/buttonStyles';
import { STORE_CONTACTS } from '../../lib/constants';
import { ROUTES } from '../../lib/routes';

export default function ContactCta() {
  return (
    <section aria-labelledby="contact-cta-heading" className="rounded-3xl bg-emerald-800 px-6 py-10 text-white shadow-soft sm:px-10 sm:py-12">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <h2 id="contact-cta-heading" className="font-display text-xl font-bold tracking-tight sm:text-2xl">
            Не знайшли потрібний товар?
          </h2>
          <p className="mt-3 text-emerald-50">
            Перегляньте весь каталог або напишіть нам — підкажемо, у якому магазині він є, і передамо побажання щодо асортименту.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to={ROUTES.catalog} className={buttonClassName({ variant: 'accent', size: 'lg' })}>
            Перейти до каталогу
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link to={ROUTES.contacts} className={buttonClassName({ variant: 'onDark', size: 'lg' })}>
            <MessageSquare className="h-4 w-4" aria-hidden="true" />
            Написати нам
          </Link>
          <a href={STORE_CONTACTS.phoneHref} className={buttonClassName({ variant: 'onDark', size: 'lg' })}>
            <Phone className="h-4 w-4" aria-hidden="true" />
            {STORE_CONTACTS.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
