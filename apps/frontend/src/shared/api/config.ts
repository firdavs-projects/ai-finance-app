/**
 * API конфигурация с enum для Tags, Methods, URLs
 */

// RTK Query cache tags
export enum ApiTags {
  TRANSACTIONS = 'Transactions',
  ACCOUNTS = 'Accounts',
  CATEGORIES = 'Categories',
  BUDGET = 'Budget',
  AI = 'AI',
}

// HTTP методы
export enum ApiMethods {
  GET = 'GET',
  POST = 'POST',
  PATCH = 'PATCH',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

// API endpoints
export enum ApiEndpoints {
  // Transactions
  TRANSACTIONS = '/transactions',
  TRANSACTION_BY_ID = '/transactions/:id',

  // Accounts
  ACCOUNTS = '/accounts',
  ACCOUNT_BY_ID = '/accounts/:id',

  // Categories
  CATEGORIES = '/categories',
  CATEGORY_BY_ID = '/categories/:id',

  // AI
  AI_PARSE = '/ai/parse',
}

/**
 * Утилита для подстановки параметров в URL
 * @example getUrl(ApiEndpoints.TRANSACTION_BY_ID, { id: '123' }) => '/transactions/123'
 */
export function getUrl(endpoint: ApiEndpoints, params?: Record<string, string>): string {
  if (!params) return endpoint

  let url = endpoint as string
  Object.entries(params).forEach(([key, value]) => {
    url = url.replace(`:${key}`, value)
  })
  return url
}

