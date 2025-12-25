import { baseApi, ApiMethods } from '@shared/api'
import { Transaction } from '@entities/transaction'

export interface ParseExpenseRequest {
  text: string
  accountId?: string
}

export interface ParseExpenseSuccessResponse {
  success: true
  transactions: Transaction[]
  message: string
}

export interface ParseExpenseClarificationResponse {
  success: false
  needsClarification: true
  question: string
}

export interface ParseExpenseErrorResponse {
  success: false
  error: string
}

export type ParseExpenseResponse =
  | ParseExpenseSuccessResponse
  | ParseExpenseClarificationResponse
  | ParseExpenseErrorResponse

export const aiApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    parseExpense: builder.mutation<ParseExpenseResponse, ParseExpenseRequest>({
      query: (body) => ({
        url: '/ai/parse',
        method: ApiMethods.POST,
        body,
      }),
      // Инвалидируем транзакции и счета при успешном парсинге
      invalidatesTags: (result) =>
        result?.success ? ['Transactions', 'Accounts'] : [],
    }),
  }),
})

export const {
  useParseExpenseMutation,
} = aiApi

