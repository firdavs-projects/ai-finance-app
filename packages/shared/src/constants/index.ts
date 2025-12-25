export const CURRENCIES = {
  TJS: { code: 'TJS', symbol: 'смн', name: 'Таджикский сомони' },
  RUB: { code: 'RUB', symbol: '₽', name: 'Российский рубль' },
  USD: { code: 'USD', symbol: '$', name: 'Доллар США' },
  KZT: { code: 'KZT', symbol: '₸', name: 'Казахстанский тенге' },
} as const;

export const DEFAULT_CURRENCY = 'TJS';

export const ACCOUNT_ICONS = ['💵', '💳', '🏦', '💰', '🐷'] as const;

export const CATEGORY_ICONS = {
  food: '🍔',
  cafe: '☕',
  groceries: '🛒',
  transport: '🚗',
  taxi: '🚕',
  fuel: '⛽',
  entertainment: '🎬',
  shopping: '🛍️',
  health: '💊',
  bills: '📱',
  salary: '💰',
  bonus: '🎁',
  freelance: '💻',
} as const;

