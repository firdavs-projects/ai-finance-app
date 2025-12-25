import { useState, useEffect } from 'react'
import {
  BanknotesIcon,
  ArrowDownTrayIcon,
  ArrowsRightLeftIcon,
  HandRaisedIcon,
  CalendarIcon,
  MapPinIcon,
  ChatBubbleLeftIcon,
} from '@heroicons/react/24/outline'
import { Button } from '@ai-finance/ui'
import { useGetCategoriesQuery } from '@entities/category'
import { useGetAccountsQuery } from '@entities/account'

type TransactionType = 'expense' | 'income' | 'transfer' | 'debt'
type DebtSubType = 'i_gave' | 'i_returned' | 'they_gave' | 'they_returned'

interface AddTransactionFormProps {
  onSubmit?: (data: any) => void
}

export function AddTransactionForm({ onSubmit }: AddTransactionFormProps) {
  const { data: categories = [], isLoading: categoriesLoading } = useGetCategoriesQuery()
  const { data: accounts = [], isLoading: accountsLoading } = useGetAccountsQuery()

  const [type, setType] = useState<TransactionType>('expense')
  const [debtSubType, setDebtSubType] = useState<DebtSubType>('i_gave')
  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [accountId, setAccountId] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [place, setPlace] = useState('')
  const [person, setPerson] = useState('')
  const [comment, setComment] = useState('')
  const [showPlaceSuggestions, setShowPlaceSuggestions] = useState(false)
  const [showPersonSuggestions, setShowPersonSuggestions] = useState(false)

  // Сохранённые места и люди (позже из localStorage или API)
  const savedPlaces = ['Do.Bro', 'Мегаплан', 'Сомон']
  const savedPeople = ['Алексей', 'Мария', 'Дмитрий']

  // Фильтруем категории по типу
  const expenseCategories = categories.filter(c => c.type === 'expense' && !c.parentId)
  const incomeCategories = categories.filter(c => c.type === 'income' && !c.parentId)
  const activeCategories = type === 'expense' ? expenseCategories : incomeCategories

  // Устанавливаем первый счёт по умолчанию
  useEffect(() => {
    if (!accountId && accounts.length > 0) {
      const defaultAccount = accounts[0]
      setAccountId(defaultAccount?.id || '')
    }
  }, [accounts, accountId])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!amount || !accountId) return

    const data = {
      type,
      ...(type === 'debt' && { debtSubType }),
      amount: parseFloat(amount),
      categoryId: type !== 'debt' ? categoryId : undefined,
      accountId,
      date,
      place: type === 'expense' ? place : undefined,
      person: type === 'debt' ? person : undefined,
      comment,
    }

    if (onSubmit) {
      onSubmit(data)
    }
  }

  const tabs = [
    { id: 'expense', label: 'Расход', icon: BanknotesIcon },
    { id: 'income', label: 'Доход', icon: ArrowDownTrayIcon },
    { id: 'transfer', label: 'Перевод', icon: ArrowsRightLeftIcon },
    { id: 'debt', label: 'Долг', icon: HandRaisedIcon },
  ]

  const debtTabs = [
    { id: 'i_gave', label: 'Я дал в долг' },
    { id: 'i_returned', label: 'Я вернул долг' },
    { id: 'they_gave', label: 'Мне дали в долг' },
    { id: 'they_returned', label: 'Мне вернули долг' },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Основные табы */}
      <div className="grid grid-cols-4 gap-1 bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setType(tab.id as TransactionType)
                setCategoryId('')
              }}
              className={`flex flex-col items-center py-2 px-1 rounded-md text-xs font-medium transition-colors ${
                type === tab.id
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="h-5 w-5 mb-1" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Суб-табы для долга */}
      {type === 'debt' && (
        <div className="grid grid-cols-2 gap-2">
          {debtTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setDebtSubType(tab.id as DebtSubType)}
              className={`py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
                debtSubType === tab.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Сумма */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Сумма
        </label>
        <div className="relative">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-2xl font-semibold text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
            смн
          </span>
        </div>
      </div>

      {/* Категории (для расход/доход) */}
      {(type === 'expense' || type === 'income') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Категория
          </label>
          {categoriesLoading ? (
            <div className="text-center py-4 text-gray-500">Загрузка...</div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {activeCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryId(cat.id)}
                  className={`flex items-center gap-2 py-3 px-4 rounded-lg border transition-colors ${
                    categoryId === cat.id
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <span className="text-xl">{cat.icon}</span>
                  <span className="text-sm font-medium">{cat.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Счёт */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {type === 'expense' ? 'Списать со счёта' : 'Зачислить на счёт'}
        </label>
        {accountsLoading ? (
          <div className="text-center py-2 text-gray-500">Загрузка...</div>
        ) : (
          <select
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.icon} {acc.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Дата */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <CalendarIcon className="inline h-4 w-4 mr-1" />
          Дата
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {/* Место платежа (для расходов) */}
      {type === 'expense' && (
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPinIcon className="inline h-4 w-4 mr-1" />
            Место платежа
          </label>
          <input
            type="text"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            onFocus={() => setShowPlaceSuggestions(true)}
            onBlur={() => setTimeout(() => setShowPlaceSuggestions(false), 200)}
            placeholder="Где потратили?"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          {showPlaceSuggestions && savedPlaces.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
              {savedPlaces
                .filter((p) => p.toLowerCase().includes(place.toLowerCase()))
                .map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      setPlace(p)
                      setShowPlaceSuggestions(false)
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                  >
                    📍 {p}
                  </button>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Имя человека (для долгов) */}
      {type === 'debt' && (
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {debtSubType.includes('i_') ? 'Кому' : 'Кто'}
          </label>
          <input
            type="text"
            value={person}
            onChange={(e) => setPerson(e.target.value)}
            onFocus={() => setShowPersonSuggestions(true)}
            onBlur={() => setTimeout(() => setShowPersonSuggestions(false), 200)}
            placeholder="Имя человека"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          {showPersonSuggestions && savedPeople.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
              {savedPeople
                .filter((p) => p.toLowerCase().includes(person.toLowerCase()))
                .map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      setPerson(p)
                      setShowPersonSuggestions(false)
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                  >
                    👤 {p}
                  </button>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Комментарий */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <ChatBubbleLeftIcon className="inline h-4 w-4 mr-1" />
          Комментарий
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Дополнительная информация..."
          rows={2}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
        />
      </div>

      {/* Кнопка отправки */}
      <Button type="submit" className="w-full">
        {type === 'expense' ? '💸 Добавить расход' :
         type === 'income' ? '💰 Добавить доход' :
         type === 'transfer' ? '💱 Перевести' :
         '📝 Добавить долг'}
      </Button>
    </form>
  )
}

