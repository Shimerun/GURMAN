import { Send } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { buttonClassName } from '../../lib/buttonStyles';
import { ROUTES } from '../../lib/routes';
import { cn } from '../../lib/utils';

const TOPICS = ['Якість товару', 'Наявність товару в магазині', 'Співпраця та постачання', 'Інше'];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_MESSAGE_LENGTH = 10;
// Upper bounds keep pasted junk out and match what a future backend will accept.
const MAX_LENGTH = { name: 100, email: 254, message: 2000 };

const EMPTY_FORM = { name: '', email: '', topic: TOPICS[0], message: '' };

const FIELD_LABELS = { name: 'Ім’я', email: 'Електронна пошта', topic: 'Тема звернення', message: 'Повідомлення' };

/** @typedef {typeof EMPTY_FORM} ContactFormValues */
/** @typedef {Partial<Record<keyof ContactFormValues, string>>} ContactFormErrors */

/** @param {ContactFormValues} values @returns {ContactFormErrors} */
function validateContactForm(values) {
  /** @type {ContactFormErrors} */
  const errors = {};
  if (values.name.trim().length < 2) errors.name = 'Вкажіть ім’я (щонайменше 2 символи).';
  if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = 'Вкажіть коректну електронну пошту, наприклад name@example.com.';
  if (values.message.trim().length < MIN_MESSAGE_LENGTH)
    errors.message = `Опишіть питання детальніше (щонайменше ${MIN_MESSAGE_LENGTH} символів).`;
  return errors;
}

const SHAKE_KEYFRAMES = [
  { transform: 'none' },
  { transform: 'translateX(-6px)' },
  { transform: 'translateX(5px)' },
  { transform: 'translateX(-3px)' },
  { transform: 'translateX(2px)' },
  { transform: 'none' },
];

/**
 * A short sideways shake on each invalid field, so the problem is noticed where it is, not
 * only in the summary. Skipped under reduced motion.
 * @param {HTMLFormElement | null} form
 * @param {string[]} fieldNames
 */
function shakeFields(form, fieldNames) {
  if (!form || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  for (const name of fieldNames) form.querySelector(`[name="${name}"]`)?.animate(SHAKE_KEYFRAMES, { duration: 360, easing: 'ease-out' });
}

const FIELD_CLASS_NAME =
  'mt-1.5 block w-full rounded-xl border bg-white px-3.5 text-base text-slate-800 transition-colors placeholder:text-slate-500 focus:outline-none focus:ring-2 sm:text-sm';

/** @param {boolean} hasError */
const getFieldClassName = (hasError) =>
  cn(
    FIELD_CLASS_NAME,
    hasError
      ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
      : 'border-slate-300 focus:border-emerald-600 focus:ring-emerald-600/20',
  );

/** Demo form: validates on the client and shows an inline confirmation; nothing is sent anywhere. */
export default function ContactForm() {
  const [values, setValues] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState(/** @type {ContactFormErrors} */ ({}));
  const [submittedName, setSubmittedName] = useState(/** @type {string | null} */ (null));
  const formRef = useRef(null);
  const successRef = useRef(null);
  const fieldId = useId();

  // Moves focus to the confirmation so keyboard and screen-reader users land on the outcome.
  useEffect(() => {
    if (submittedName !== null) successRef.current?.focus();
  }, [submittedName]);

  /** @param {keyof ContactFormValues} name */
  const handleChange = (name) => (event) => {
    const { value } = event.target;
    setValues((previous) => ({ ...previous, [name]: value }));
    // Errors clear as soon as the user starts fixing the field; full validation reruns on submit.
    if (errors[name]) setErrors((previous) => ({ ...previous, [name]: undefined }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validateContactForm(values);
    setErrors(nextErrors);

    const invalidFields = Object.keys(nextErrors);
    if (invalidFields.length > 0) {
      formRef.current?.querySelector(`[name="${invalidFields[0]}"]`)?.focus();
      shakeFields(formRef.current, invalidFields);
      return;
    }

    setSubmittedName(values.name.trim());
    setValues(EMPTY_FORM);
  };

  const errorEntries = Object.entries(errors).filter(([, message]) => Boolean(message));

  /** @param {keyof ContactFormValues} name */
  const describedBy = (name) => (errors[name] ? `${fieldId}-${name}-error` : undefined);

  /** @param {keyof ContactFormValues} name */
  const renderError = (name) =>
    errors[name] && (
      <p id={`${fieldId}-${name}-error`} className="mt-1.5 text-sm font-medium text-red-700">
        {errors[name]}
      </p>
    );

  if (submittedName !== null) {
    return (
      <div
        ref={successRef}
        role="status"
        tabIndex={-1}
        className="flex flex-col items-start gap-3 rounded-2xl bg-emerald-50 p-6 ring-1 ring-emerald-100 focus:outline-none"
      >
        {/* Circle and tick draw themselves (index.css `.check-draw`); static with reduced motion. */}
        <svg viewBox="0 0 32 32" className="check-draw h-10 w-10" aria-hidden="true" focusable="false">
          <circle cx="16" cy="16" r="13.5" pathLength="1" fill="none" strokeWidth="2.5" className="check-circle stroke-emerald-600" />
          <path d="M10 16.5l4 4 8-8.5" pathLength="1" fill="none" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" className="check-tick stroke-emerald-700" />
        </svg>
        <h3 className="text-lg font-semibold text-slate-900">Дякуємо, {submittedName}!</h3>
        <p className="text-sm text-slate-600">
          Форма заповнена правильно. Це демо-версія сайту, тому повідомлення нікуди не надіслано — для швидкої відповіді зателефонуйте на
          гарячу лінію або напишіть нам на пошту.
        </p>
        <button type="button" onClick={() => setSubmittedName(null)} className={buttonClassName({ variant: 'secondary', size: 'sm' })}>
          Написати ще одне повідомлення
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-4" aria-describedby={`${fieldId}-required`}>
      <p id={`${fieldId}-required`} className="text-sm text-slate-600">
        Усі поля обов’язкові.
      </p>
      {errorEntries.length > 0 && (
        <div role="alert" className="rounded-2xl bg-red-50 p-4 text-sm text-red-900 ring-1 ring-red-200">
          <p className="font-semibold">Перевірте {errorEntries.length === 1 ? 'поле' : 'поля'}:</p>
          <ul className="mt-1 list-inside list-disc">
            {errorEntries.map(([name]) => (
              <li key={name}>{FIELD_LABELS[name]}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${fieldId}-name`} className="text-sm font-semibold text-slate-800">
            Ім’я
          </label>
          <input
            id={`${fieldId}-name`}
            name="name"
            autoComplete="name"
            maxLength={MAX_LENGTH.name}
            value={values.name}
            onChange={handleChange('name')}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={describedBy('name')}
            className={cn(getFieldClassName(Boolean(errors.name)), 'h-11')}
          />
          {renderError('name')}
        </div>
        <div>
          <label htmlFor={`${fieldId}-email`} className="text-sm font-semibold text-slate-800">
            Електронна пошта
          </label>
          <input
            id={`${fieldId}-email`}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            maxLength={MAX_LENGTH.email}
            value={values.email}
            onChange={handleChange('email')}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={describedBy('email')}
            className={cn(getFieldClassName(Boolean(errors.email)), 'h-11')}
          />
          {renderError('email')}
        </div>
      </div>

      <div>
        <label htmlFor={`${fieldId}-topic`} className="text-sm font-semibold text-slate-800">
          Тема звернення
        </label>
        <select
          id={`${fieldId}-topic`}
          name="topic"
          value={values.topic}
          onChange={handleChange('topic')}
          className={cn(getFieldClassName(false), 'h-11')}
        >
          {TOPICS.map((topic) => (
            <option key={topic}>{topic}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor={`${fieldId}-message`} className="text-sm font-semibold text-slate-800">
          Повідомлення
        </label>
        <textarea
          id={`${fieldId}-message`}
          name="message"
          rows={5}
          maxLength={MAX_LENGTH.message}
          value={values.message}
          onChange={handleChange('message')}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={describedBy('message')}
          className={cn(getFieldClassName(Boolean(errors.message)), 'resize-y py-2.5')}
        />
        {renderError('message')}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className={buttonClassName({ size: 'lg' })}>
          <Send className="h-4 w-4" aria-hidden="true" />
          Надіслати
        </button>
        <p className="text-sm text-slate-600">Демо-форма: повідомлення не надсилається на сервер.</p>
      </div>
      <p className="text-sm text-slate-600">
        Надсилаючи форму, ви погоджуєтеся з{' '}
        <Link to={ROUTES.privacy} className="font-semibold text-emerald-800 underline underline-offset-2">
          політикою конфіденційності
        </Link>
        .
      </p>
    </form>
  );
}
