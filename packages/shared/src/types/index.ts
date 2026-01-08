// Transaction Types
export type TransactionType = 'income' | 'expense' | 'transfer' | 'debt';

export type DebtSubType = 'i_gave' | 'i_returned' | 'they_gave' | 'they_returned';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  currency: string;
  categoryId?: string;
  accountId: string;
  accountToId?: string; // for transfers
  description?: string;
  place?: string;
  person?: string;
  comment?: string;
  debtSubType?: DebtSubType;
  date: Date;
  createdAt: Date;
  updatedAt?: Date;
}

// Account Types
export type AccountType = 'cash' | 'card' | 'bank' | 'savings' | 'debt';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  color?: string;
  icon?: string;
  isDebt?: boolean;
  isHidden?: boolean;
  debtPerson?: string;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  icon?: string;
  color?: string;
  parentId?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AiParseResponse {
  success: boolean;
  transactions?: Transaction[];
  needsClarification?: boolean;
  question?: string;
  error?: string;
  message?: string;
}

// Create DTOs
export interface CreateTransactionDto {
  type: TransactionType;
  amount: number;
  currency?: string;
  categoryId: string;
  accountId: string;
  toAccountId?: string;
  description?: string;
  date?: string;
}

export interface CreateAccountDto {
  name: string;
  type: AccountType;
  balance?: number;
  currency?: string;
  color?: string;
  icon?: string;
}

export interface CreateCategoryDto {
  name: string;
  type: 'income' | 'expense';
  icon?: string;
  color?: string;
  parentId?: string;
}

