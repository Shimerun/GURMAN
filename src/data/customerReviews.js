/**
 * Demo testimonials (no reviews backend yet).
 * @typedef {Object} CustomerReview
 * @property {string} id
 * @property {string} author
 * @property {string} store Store the customer usually visits
 * @property {number} rating 1..5
 * @property {string} text
 */

/** @type {CustomerReview[]} */
export const CUSTOMER_REVIEWS = [
  {
    id: 'review-1',
    author: 'Олена Кравчук',
    store: 'GURMAN Михайлівська',
    rating: 5,
    text: 'Хліб на заквасці беру тут щоранку — ще теплий о восьмій. А сир від місцевої сироварні тепер купую лише в GURMAN.',
  },
  {
    id: 'review-2',
    author: 'Андрій Мельник',
    store: 'GURMAN Бердичівська',
    rating: 5,
    text: 'Рятує, що магазин цілодобовий: після нічної зміни завжди можна взяти свіже м’ясо та овочі. Каси працюють швидко.',
  },
  {
    id: 'review-3',
    author: 'Ірина Савчук',
    store: 'GURMAN Корбутівка',
    rating: 4,
    text: 'Акції тижня справді вигідні, а не «знижка» на завищену ціну. Хотілося б більше безлактозних продуктів, але асортимент росте.',
  },
  {
    id: 'review-4',
    author: 'Тарас Бондар',
    store: 'GURMAN Покровська',
    rating: 5,
    text: 'Один раз трапився пом’ятий йогурт — замінили на касі без жодних питань. Приємно, коли магазин тримає слово.',
  },
];
