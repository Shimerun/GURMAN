import { FileWarning } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/ui/PageHeader';
import { BRAND_NAME, IS_DEMO_CONTENT, LEGAL_ENTITY, PRIVACY_POLICY_UPDATED } from '../config/business';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { STORE_CONTACTS } from '../lib/constants';
import { formatDayMonth } from '../lib/format';
import { ROUTES } from '../lib/routes';

const UPDATED_LABEL = `${formatDayMonth(PRIVACY_POLICY_UPDATED)} ${PRIVACY_POLICY_UPDATED.slice(0, 4)} р.`;

// Until the client provides seller details, bracketed placeholders keep the gaps obvious.
const CONTROLLER = LEGAL_ENTITY
  ? `${LEGAL_ENTITY.name}, код ${LEGAL_ENTITY.taxId}, адреса: ${LEGAL_ENTITY.address}`
  : '[назва ФОП або ТОВ], код ЄДРПОУ / РНОКПП [код], адреса: [адреса]';
const PRIVACY_EMAIL = LEGAL_ENTITY?.email ?? STORE_CONTACTS.email;

const DATA_SUBJECT_RIGHTS = [
  'знати, які ваші дані ми обробляємо, з якою метою і хто має до них доступ;',
  'отримати доступ до своїх даних;',
  'вимагати виправлення неточних даних або їх видалення;',
  'відкликати згоду на обробку в будь-який момент;',
  'заперечити проти обробки своїх даних;',
  'звернутися зі скаргою до Уповноваженого Верховної Ради України з прав людини або до суду.',
];

/** @param {{ id: string, title: string, children: import('react').ReactNode }} props */
function PolicySection({ id, title, children }) {
  return (
    <section aria-labelledby={id} className="space-y-3">
      <h2 id={id} className="font-display text-lg font-bold text-slate-900 sm:text-xl">
        {title}
      </h2>
      <div className="space-y-3 leading-relaxed text-slate-700">{children}</div>
    </section>
  );
}

/**
 * Privacy policy template for the contact form and the browser-stored cart. Written for
 * Ukrainian law ("Про захист персональних даних"); must be reviewed by a lawyer before launch.
 */
export default function PrivacyPage() {
  useDocumentTitle('Політика конфіденційності', `Як ${BRAND_NAME} обробляє персональні дані відвідувачів сайту: що збираємо, навіщо, як довго зберігаємо та які у вас права.`);

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Політика конфіденційності"
        eyebrow="Персональні дані"
        breadcrumbs={[{ label: 'Політика конфіденційності' }]}
        description={`Редакція від ${UPDATED_LABEL}`}
      />

      {IS_DEMO_CONTENT && (
        <p className="mb-8 flex items-start gap-3 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900 ring-1 ring-amber-200">
          <FileWarning className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          Це шаблон для демо-версії сайту. Перед запуском його має перевірити юрист, а дані володільця в квадратних дужках — замінити на
          реальні.
        </p>
      )}

      <div className="space-y-8 sm:space-y-10">
        <PolicySection id="privacy-controller" title="1. Хто обробляє ваші дані">
          <p>Володілець персональних даних — {CONTROLLER}.</p>
          <p>
            Політика діє для сайту {BRAND_NAME} і пояснює, як ми обробляємо дані відповідно до Закону України «Про захист персональних
            даних».
          </p>
        </PolicySection>

        <PolicySection id="privacy-data" title="2. Які дані ми отримуємо">
          <ul className="list-inside list-disc space-y-1.5">
            <li>
              <span className="font-semibold text-slate-900">Форма зворотного зв’язку:</span> ім’я, електронна пошта, тема та текст
              звернення — лише те, що ви вводите самі.
            </li>
            <li>
              <span className="font-semibold text-slate-900">Кошик:</span> зберігається тільки у вашому браузері (localStorage) і на наш
              сервер не надсилається. Його можна очистити в будь-який момент.
            </li>
            <li>
              <span className="font-semibold text-slate-900">Технічні дані:</span> сервер, на якому розміщено сайт, може фіксувати
              IP-адресу, тип браузера та час запиту для захисту від атак і збоїв.
            </li>
          </ul>
          <p>Сайт не використовує рекламних чи аналітичних файлів cookie. Якщо це зміниться, ми оновимо політику й попросимо вашої згоди.</p>
        </PolicySection>

        <PolicySection id="privacy-purpose" title="3. Навіщо та на якій підставі">
          <p>
            Дані з форми використовуємо лише для того, щоб відповісти на ваше звернення. Підстава — ваша згода, яку ви надаєте,
            надсилаючи форму.
          </p>
        </PolicySection>

        <PolicySection id="privacy-retention" title="4. Як довго зберігаємо">
          <p>Не довше, ніж потрібно для відповіді на звернення, і не більше 12 місяців після останнього листування. Потім дані видаляємо.</p>
        </PolicySection>

        <PolicySection id="privacy-sharing" title="5. Кому передаємо">
          <p>
            Ми не продаємо й не передаємо ваші дані третім особам, окрім випадків, прямо передбачених законом. Технічно дані можуть
            зберігатися в постачальника хостингу, який не має права використовувати їх для власних цілей.
          </p>
          {IS_DEMO_CONTENT && (
            <p>
              У демо-версії фото товарів завантажуються із сервісу Unsplash: ваш браузер звертається до його серверів, тож вони бачать
              вашу IP-адресу, але не адресу сторінки сайту, яку ви переглядаєте.
            </p>
          )}
        </PolicySection>

        <PolicySection id="privacy-rights" title="6. Ваші права">
          <p>Відповідно до статті 8 Закону України «Про захист персональних даних» ви маєте право:</p>
          <ul className="list-inside list-disc space-y-1.5">
            {DATA_SUBJECT_RIGHTS.map((right) => (
              <li key={right}>{right}</li>
            ))}
          </ul>
        </PolicySection>

        <PolicySection id="privacy-contact" title="7. Як звернутися">
          <p>
            Запити щодо персональних даних надсилайте на{' '}
            <a href={`mailto:${PRIVACY_EMAIL}`} className="font-semibold text-emerald-800 underline underline-offset-2">
              {PRIVACY_EMAIL}
            </a>
            . Відповімо протягом 30 календарних днів. Інші питання —{' '}
            <Link to={ROUTES.contacts} className="font-semibold text-emerald-800 underline underline-offset-2">
              на сторінці контактів
            </Link>
            .
          </p>
        </PolicySection>
      </div>
    </div>
  );
}
