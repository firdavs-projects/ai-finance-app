import { CategoryManager } from './CategoryManager'

export function SettingsPage() {
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Настройки</h1>

      <div className="space-y-8">
        {/* Управление категориями */}
        <div className="bg-gray-50 rounded-xl p-6">
          <CategoryManager />
        </div>

        {/* Дополнительные секции настроек можно добавить здесь */}
      </div>
    </div>
  )
}



