import { baseApi, ApiTags, ApiMethods, ApiEndpoints, getUrl } from '@shared/api'

export interface Account {
  id: string
  name: string
  type: 'cash' | 'card' | 'bank' | 'savings'
  balance: number
  currency: string
  color?: string
  icon?: string
}

export interface CreateAccountDto {
  name: string
  type: 'cash' | 'card' | 'bank' | 'savings'
  balance?: number
  currency?: string
  color?: string
  icon?: string
}

export const accountsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAccounts: builder.query<Account[], void>({
      query: () => ApiEndpoints.ACCOUNTS,
      providesTags: [ApiTags.ACCOUNTS],
    }),
    getAccount: builder.query<Account, string>({
      query: (id) => getUrl(ApiEndpoints.ACCOUNT_BY_ID, { id }),
      providesTags: (_result, _error, id) => [{ type: ApiTags.ACCOUNTS, id }],
    }),
    createAccount: builder.mutation<Account, CreateAccountDto>({
      query: (body) => ({
        url: ApiEndpoints.ACCOUNTS,
        method: ApiMethods.POST,
        body,
      }),
      invalidatesTags: [ApiTags.ACCOUNTS],
    }),
    updateAccount: builder.mutation<Account, { id: string; data: Partial<CreateAccountDto> }>({
      query: ({ id, data }) => ({
        url: getUrl(ApiEndpoints.ACCOUNT_BY_ID, { id }),
        method: ApiMethods.PATCH,
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: ApiTags.ACCOUNTS, id }, ApiTags.ACCOUNTS],
    }),
    deleteAccount: builder.mutation<void, string>({
      query: (id) => ({
        url: getUrl(ApiEndpoints.ACCOUNT_BY_ID, { id }),
        method: ApiMethods.DELETE,
      }),
      invalidatesTags: [ApiTags.ACCOUNTS],
    }),
  }),
})

export const {
  useGetAccountsQuery,
  useGetAccountQuery,
  useCreateAccountMutation,
  useUpdateAccountMutation,
  useDeleteAccountMutation,
} = accountsApi

