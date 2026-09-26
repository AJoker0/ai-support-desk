export const APP_CONFIG = {
  name: 'Support Hub',
  tagline: 'Вхідні тікети та автокласифікація',
  llmModel: 'gemini-2.5-flash',
  llmLabel: 'Gemini 2.5 Flash',
} as const;

export type PriorityLevel = 'низький' | 'середній' | 'високий';

export const PRIORITY_CONFIG: Record<
  PriorityLevel,
  { label: string; badgeClass: string; dotClass: string }
> = {
  високий: {
    label: 'Високий',
    badgeClass: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
    dotClass: 'bg-rose-500',
  },
  середній: {
    label: 'Середній',
    badgeClass: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    dotClass: 'bg-amber-500',
  },
  низький: {
    label: 'Низький',
    badgeClass: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    dotClass: 'bg-emerald-500',
  },
};

export const QUICK_TEMPLATES = [
  {
    title: 'Затримка посилки',
    name: 'Ігор Мельник',
    content: 'Добрий день. Замовлення #7821 мало приїхати ще у вівторок, але трекінг не оновлюється вже 3 дні. Коли чекати кур’єра?',
  },
  {
    title: 'Подвійне списання',
    name: 'Марина Ткач',
    content: 'Сьогодні при оформленні підписки гроші з картки списалися двічі по 399 грн. Будь ласка, перевірте транзакції та поверніть надлишок.',
  },
  {
    title: 'Подяка',
    name: 'Артем Дяченко',
    content: 'Щиро дякую вашому оператору за швидку заміну товару вчора у магазині, сервіс на висоті!',
  },
] as const;