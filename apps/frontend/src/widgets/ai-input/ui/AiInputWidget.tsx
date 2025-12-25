import { useState } from 'react'
import { SparklesIcon, PaperAirplaneIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { useParseExpenseMutation } from '@entities/ai'
import { useGetAccountsQuery } from '@entities/account'

export function AiInputWidget() {
  const [input, setInput] = useState('')
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'question'
    message: string
  } | null>(null)

  const [parseExpense, { isLoading }] = useParseExpenseMutation()
  const { data: accounts = [] } = useGetAccountsQuery()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    try {
      const defaultAccountId = accounts[0]?.id
      const result = await parseExpense({
        text: input,
        accountId: defaultAccountId
      }).unwrap()

      if (result.success) {
        setNotification({
          type: 'success',
          message: result.message
        })
        setInput('')
        // Скрываем уведомление через 3 секунды
        setTimeout(() => setNotification(null), 3000)
      } else if ('needsClarification' in result && result.needsClarification) {
        setNotification({
          type: 'question',
          message: result.question
        })
      } else if ('error' in result) {
        setNotification({
          type: 'error',
          message: result.error
        })
        setTimeout(() => setNotification(null), 4000)
      }
    } catch (error) {
      console.error('Error processing AI input:', error)
      setNotification({
        type: 'error',
        message: 'Произошла ошибка при обработке запроса'
      })
      setTimeout(() => setNotification(null), 4000)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Отправка по Ctrl/Cmd + Enter
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  return (
    <div className="fixed bottom-16 left-0 right-0 px-4 pb-2 bg-gradient-to-t from-gray-50 via-gray-50 to-transparent pt-4">
      {/* Уведомления */}
      {notification && (
        <div className={`max-w-lg mx-auto mb-3 p-3 rounded-lg shadow-lg border ${
          notification.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : notification.type === 'error'
            ? 'bg-red-50 border-red-200 text-red-800'
            : 'bg-blue-50 border-blue-200 text-blue-800'
        }`}>
          <div className="flex items-start gap-2">
            {notification.type === 'success' ? (
              <CheckCircleIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
            ) : (
              <ExclamationCircleIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
            )}
            <p className="text-sm font-medium">{notification.message}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
        <div className="flex items-start gap-2 bg-white rounded-2xl shadow-lg border border-gray-200 px-4 py-3">
          <SparklesIcon className="h-6 w-6 text-primary-500 mt-1 flex-shrink-0" />
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Напишите расход... (американо 22смн, чизкейк 15смн)
Ctrl/Cmd + Enter для отправки"
            className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 text-sm resize-none min-h-[40px] max-h-[120px]"
            disabled={isLoading}
            rows={1}
            style={{ height: 'auto' }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement
              target.style.height = 'auto'
              target.style.height = target.scrollHeight + 'px'
            }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2 rounded-full bg-primary-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-600 transition-colors flex-shrink-0 mt-1"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <PaperAirplaneIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

