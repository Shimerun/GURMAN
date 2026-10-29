import { FREE_DELIVERY_THRESHOLD } from '../lib/constants';

/** Shared by the desktop HeroBanner and the mobile HomeScreen carousel. */
export const HERO_SLIDES = [
  {
    id: 'dairy',
    eyebrow: 'Акція тижня',
    title: 'Знижки до -30% на молочні продукти',
    description: 'Молоко, сири та вершкове масло від фермерських господарств — щоранку на полицях.',
    ctaLabel: 'Обрати молочне',
    categoryId: 'dairy',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=1200&q=70&auto=format',
    mobileImage: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&q=70&auto=format',
    imageAlt: 'Свіже молоко наливають у склянку',
    backgroundClassName: 'from-emerald-800 via-emerald-700 to-emerald-500',
  },
  {
    id: 'produce',
    eyebrow: 'Щодня свіже',
    title: 'Овочі та фрукти — з поля до полиці за 24 години',
    description: 'Сезонний урожай від українських фермерів і стиглі фрукти з усього світу.',
    ctaLabel: 'До овочів і фруктів',
    categoryId: 'produce',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=1200&q=70&auto=format',
    mobileImage: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&q=70&auto=format',
    imageAlt: 'Асорті свіжих фруктів',
    backgroundClassName: 'from-lime-800 via-emerald-700 to-emerald-600',
  },
  {
    id: 'delivery',
    eyebrow: 'Доставка',
    title: 'Привеземо продукти за 2 години',
    description: `Безкоштовна доставка для замовлень від ₴ ${FREE_DELIVERY_THRESHOLD}. Збираємо кошик так, ніби для себе.`,
    ctaLabel: 'До каталогу',
    categoryId: null,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=70&auto=format',
    mobileImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=70&auto=format',
    imageAlt: 'Полиці з овочами та фруктами в супермаркеті',
    backgroundClassName: 'from-slate-900 via-slate-800 to-emerald-800',
  },
];
