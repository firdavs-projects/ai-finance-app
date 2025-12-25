import { useState } from 'react'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useGetAccountsQuery, useCreateAccountMutation, useDeleteAccountMutation } from '@entities/account'

export function AccountsPage() {
  const [isCreating, setIsCreating] = useState(false)
  const { data: accounts = [], isLoading } = useGetAccountsQuery()
  const [createAccount] = useCreateAccountMutation()
  const [deleteAccount] = useDeleteAccountMutation()

  const [newAccount, setNewAccount] = useState({
    name: '',
    type: 'cash' as const,
    balance: 0,
    icon: '💵',
  })

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createAccount(newAccount).unwrap()
      setNewAccount({ name: '', type: 'cash', balance: 0, icon: '💵' })
      setIsCreating(false)
    } catch (error) {
      console.error('Failed to create account:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Удалить этот счёт?')) {
      try {
        await deleteAccount(id).unwrap()
      } catch (error) {
        console.error('Failed to delete:', error)
      }
    }
  }

  const accountTypes = [
    { value: 'cash', label: 'Наличные', icon: '💵' },
    { value: 'card', label: 'Карта', icon: '💳' },
    { value: 'bank', label: 'Банк', icon: '🏦' },
    { value: 'savings', label: 'Накопления', icon: '🐷' },
  ]

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Счета</h1>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors shadow-lg"
        >
          <PlusIcon className="h-5 w-5" />
          <span className="text-sm font-medium">Добавить</span>
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreate} className="bg-white rounded-lg p-4 shadow-md border border-primary-200 mb-4">
          <h3 className="font-semibold mb-3">Новый счёт</h3>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Название</label>
              <input
                type="text"
                value={newAccount.name}
                onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                placeholder="Моя карта"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Тип</label>
              <select
                value={newAccount.type}
                onChange={(e) => setNewAccount({ ...newAccount, type: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {accountTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Начальный баланс</label>
              <input
                type="number"
                value={newAccount.balance}
                onChange={(e) => setNewAccount({ ...newAccount, balance: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-2">
              <button type="submit" className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600">
                Создать
              </button>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Отмена
              </button>
            </div>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="text-center py-8 text-gray-500">Загрузка...</div>
      ) : (
        <div className="space-y-3">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{account.icon}</span>
                    <div>
                      <div className="font-semibold text-gray-900">{account.name}</div>
                      <div className="text-xs text-gray-500">{account.type}</div>
                    </div>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gray-900">
                      {account.balance}
                    </span>
                    <span className="text-sm text-gray-400">{account.currency}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(account.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

