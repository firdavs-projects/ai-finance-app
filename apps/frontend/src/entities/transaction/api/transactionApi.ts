import { baseApi, ApiTags, ApiMethods, ApiEndpoints, getUrl } from '@shared/api'

export interface Transaction {
  id: string
  type: 'income' | 'expense' | 'transfer' | 'debt'
  amount: number
  currency: string
  categoryId?: string
  accountId: string
  accountToId?: string
  description?: string
  place?: string
  person?: string
  debtSubType?: 'i_gave' | 'i_returned' | 'they_gave' | 'they_returned'
  date: string
  createdAt: string
}

export interface CreateTransactionDto {
  type: 'income' | 'expense' | 'transfer' | 'debt'
  amount: number
  currency?: string
  categoryId?: string
  accountId: string
  accountToId?: string
  description?: string
  place?: string
  person?: string
  debtSubType?: 'i_gave' | 'i_returned' | 'they_gave' | 'they_returned'
  date?: string
  comment?: string
}

export const transactionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTransactions: builder.query<Transaction[], void>({
      query: () => ApiEndpoints.TRANSACTIONS,
      providesTags: [ApiTags.TRANSACTIONS],
    }),
    getTransaction: builder.query<Transaction, string>({
      query: (id) => getUrl(ApiEndpoints.TRANSACTION_BY_ID, { id }),
      providesTags: (_result, _error, id) => [{ type: ApiTags.TRANSACTIONS, id }],
    }),
    createTransaction: builder.mutation<Transaction, CreateTransactionDto>({
      query: (body) => ({
        url: ApiEndpoints.TRANSACTIONS,
        method: ApiMethods.POST,
        body,
      }),
      invalidatesTags: [ApiTags.TRANSACTIONS, ApiTags.ACCOUNTS],
    }),
    updateTransaction: builder.mutation<Transaction, { id: string; data: Partial<CreateTransactionDto> }>({
      query: ({ id, data }) => ({
        url: getUrl(ApiEndpoints.TRANSACTION_BY_ID, { id }),
        method: ApiMethods.PATCH,
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: ApiTags.TRANSACTIONS, id }, ApiTags.TRANSACTIONS, ApiTags.ACCOUNTS],
    }),
    deleteTransaction: builder.mutation<void, string>({
      query: (id) => ({
        url: getUrl(ApiEndpoints.TRANSACTION_BY_ID, { id }),
        method: ApiMethods.DELETE,
      }),
      invalidatesTags: [ApiTags.TRANSACTIONS, ApiTags.ACCOUNTS],
    }),
  }),
})

export const {
  useGetTransactionsQuery,
  useGetTransactionQuery,
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
} = transactionsApi

