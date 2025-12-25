import { useState } from 'react'
import { PlusIcon } from '@heroicons/react/24/outline'
import { AddTransactionModal } from '@widgets/add-transaction-modal'

export function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Главная</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors shadow-lg"
        >
          <PlusIcon className="h-5 w-5" />
          <span className="text-sm font-medium">Добавить</span>
        </button>
      </div>

      <div className="text-gray-600">
        Добро пожаловать в AI Finance - умное приложение для учёта финансов!
      </div>

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}
