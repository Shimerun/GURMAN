import { Apple, Beef, Carrot, Cookie, Croissant, CupSoda, LayoutGrid, Milk, Snowflake, Wheat } from 'lucide-react';

// Services return icon keys (serializable), the UI owns the mapping to components.
const CATEGORY_ICONS = {
  milk: Milk,
  apple: Apple,
  carrot: Carrot,
  beef: Beef,
  croissant: Croissant,
  wheat: Wheat,
  'cup-soda': CupSoda,
  cookie: Cookie,
  snowflake: Snowflake,
};

export default function CategoryIcon({ name, className }) {
  const Icon = CATEGORY_ICONS[name] ?? LayoutGrid;
  return <Icon className={className} aria-hidden="true" />;
}
