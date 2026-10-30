import { Quote } from 'lucide-react';
import { CUSTOMER_REVIEWS } from '../../data/customerReviews';
import Rating from '../ui/Rating';
import SectionHeader from '../ui/SectionHeader';

/** @param {string} fullName */
const getInitials = (fullName) =>
  fullName
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

export default function CustomerReviews() {
  return (
    <section aria-labelledby="reviews-heading">
      <SectionHeader id="reviews-heading" eyebrow="Відгуки" title="Що кажуть покупці" />
      <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {CUSTOMER_REVIEWS.map((review) => (
          <li key={review.id}>
            <figure className="flex h-full flex-col rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <Rating rating={review.rating} />
                <Quote className="h-6 w-6 text-emerald-100" aria-hidden="true" />
              </div>
              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-slate-700">
                <p>«{review.text}»</p>
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
                <span
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald-600 text-sm font-bold text-white"
                  aria-hidden="true"
                >
                  {getInitials(review.author)}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-slate-900">{review.author}</span>
                  <span className="block truncate text-xs text-slate-500">{review.store}</span>
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
