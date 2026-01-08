export {
  accountsApi,
  useGetAccountsQuery,
  useGetRegularAccountsQuery,
  useGetDebtAccountsQuery,
  useGetAccountQuery,
  useCreateAccountMutation,
  useUpdateAccountMutation,
  useCloseDebtMutation,
  useReopenDebtMutation,
  useDeleteAccountMutation
} from './api/accountApi'
export type { Account, CreateAccountDto } from './api/accountApi'

