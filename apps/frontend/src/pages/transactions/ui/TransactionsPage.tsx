import { useState } from 'react'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useGetTransactionsQuery, useDeleteTransactionMutation } from '@entities/transaction'
import { useGetCategoriesQuery } from '@entities/category'
import { useGetAccountsQuery } from '@entities/account'
import { AddTransactionModal } from '@widgets/add-transaction-modal'

export function TransactionsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { data: transactions = [], isLoading } = useGetTransactionsQuery()
  const { data: categories = [] } = useGetCategoriesQuery()
  const { data: accounts = [] } = useGetAccountsQuery()
  const [deleteTransaction] = useDeleteTransactionMutation()

  const getCategoryName = (id?: string) => {
    const category = categories.find(c => c.id === id)
    return category ? `${category.icon} ${category.name}` : 'Без категории'
  }

  const getAccountName = (id: string) => {
    const account = accounts.find(a => a.id === id)
    return account ? `${account.icon} ${account.name}` : id
  }

  const handleDelete = async (id: string) => {
    if (confirm('Удалить эту транзакцию?')) {
      try {
        await deleteTransaction(id).unwrap()
      } catch (error) {
        console.error('Failed to delete:', error)
      }
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'expense': return '💸 Расход'
      case 'income': return '💰 Доход'
      case 'transfer': return '💱 Перевод'
      case 'debt': return '📝 Долг'
      default: return type
    }
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Операции</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors shadow-lg"
        >
          <PlusIcon className="h-5 w-5" />
          <span className="text-sm font-medium">Добавить</span>
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-gray-500">Загрузка...</div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>Нет транзакций</p>
          <p className="text-sm mt-2">Нажмите "+" чтобы добавить</p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-gray-500">
                      {getTypeLabel(transaction.type)}
                    </span>
                    {transaction.categoryId && (
                      <span className="text-xs text-gray-400">•</span>
                    )}
                    {transaction.categoryId && (
                      <span className="text-xs text-gray-600">
                        {getCategoryName(transaction.categoryId)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline gap-2 mb-2">
                    <span className={`text-2xl font-bold ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-gray-900'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}{transaction.amount}
                    </span>
                    <span className="text-sm text-gray-400">смн</span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>{getAccountName(transaction.accountId)}</span>
                    <span>•</span>
                    <span>{new Date(transaction.date).toLocaleDateString('ru-RU')}</span>
                  </div>

                  {transaction.place && (
                    <div className="mt-2 text-xs text-gray-600">
                      📍 {transaction.place}
                    </div>
                  )}

                  {transaction.person && (
                    <div className="mt-2 text-xs text-gray-600">
                      👤 {transaction.person}
                    </div>
                  )}

                  {transaction.description && (
                    <div className="mt-2 text-sm text-gray-600">
                      {transaction.description}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleDelete(transaction.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}

