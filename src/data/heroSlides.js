import { IN_CITY } from '../lib/constants';
import { ROUTES, getCategoryPath } from '../lib/routes';

/** `to` is the primary CTA target; every slide also offers a secondary "browse categories" link. */
export const HERO_SLIDES = [
  {
    id: 'welcome',
    eyebrow: 'Супермаркет GURMAN',
    title: 'Свіжі продукти щодня — поруч із домом',
    description: `Фермерські овочі, власна пекарня та м’ясо від перевірених господарств. Понад 70 товарів у каталозі та чотири магазини ${IN_CITY}.`,
    ctaLabel: 'Перейти до каталогу',
    to: ROUTES.catalog,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=70&auto=format',
    imageAlt: 'Полиці з овочами та фруктами в супермаркеті',
    backgroundClassName: 'from-slate-900 via-slate-800 to-emerald-800',
  },
  {
    id: 'dairy',
    eyebrow: 'Акція тижня',
    title: 'Знижки до -30% на молочні продукти',
    description: 'Молоко, сири та вершкове масло від фермерських господарств — щоранку на полицях.',
    ctaLabel: 'Обрати молочне',
    to: getCategoryPath('dairy', { onlyPromo: true, sort: 'discount' }),
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=1200&q=70&auto=format',
    imageAlt: 'Свіже молоко наливають у склянку',
    backgroundClassName: 'from-emerald-800 via-emerald-700 to-emerald-500',
  },
  {
    id: 'vegetables',
    eyebrow: 'Щодня свіже',
    title: 'Овочі та зелень — з поля до полиці за 24 години',
    description: 'Сезонний урожай від фермерів Житомирщини: огірки, томати, картопля й ароматна зелень.',
    ctaLabel: 'Обрати овочі',
    to: getCategoryPath('vegetables'),
    image: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=1200&q=70&auto=format',
    imageAlt: 'Асорті свіжих овочів',
    backgroundClassName: 'from-lime-800 via-emerald-700 to-emerald-600',
  },
];
