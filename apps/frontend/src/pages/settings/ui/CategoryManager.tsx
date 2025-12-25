import { useState, useMemo } from 'react'
import { Button } from '@ai-finance/ui'
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  type Category,
  type CreateCategoryDto,
} from '@entities/category'
import { CategoryModal } from './CategoryModal'
import { CategoryList } from './CategoryList'

type TabType = 'expense' | 'income'

export function CategoryManager() {
  const [activeTab, setActiveTab] = useState<TabType>('expense')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | undefined>()

  // API hooks
  const { data: categories = [], isLoading: isLoadingCategories } = useGetCategoriesQuery()
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation()
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation()
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation()

  // Фильтрация категорий по типу
  const filteredCategories = useMemo(() => {
    return categories.filter(cat => cat.type === activeTab)
  }, [categories, activeTab])

  const handleOpenModal = (category?: Category) => {
    setEditingCategory(category)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingCategory(undefined)
  }

  const handleSubmit = async (data: CreateCategoryDto) => {
    try {
      if (editingCategory) {
        await updateCategory({ id: editingCategory.id, data }).unwrap()
      } else {
        await createCategory(data).unwrap()
      }
      handleCloseModal()
    } catch (error) {
      console.error('Ошибка при сохранении категории:', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id).unwrap()
    } catch (error) {
      console.error('Ошибка при удалении категории:', error)
    }
  }

  const isAnyLoading = isLoadingCategories || isCreating || isUpdating || isDeleting

  return (
    <div className="space-y-6">
      {/* Заголовок и кнопка добавления */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Категории</h2>
          <p className="text-sm text-gray-600 mt-1">
            Управление категориями для расходов и доходов
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => handleOpenModal()}
          disabled={isAnyLoading}
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Добавить
        </Button>
      </div>

      {/* Вкладки */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px space-x-8">
          <button
            onClick={() => setActiveTab('expense')}
            disabled={isAnyLoading}
            className={`
              py-3 px-1 border-b-2 font-medium text-sm transition-colors
              ${activeTab === 'expense'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            <span className="flex items-center gap-2">
              <span>📉</span>
              Расходы
              <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                {categories.filter(cat => cat.type === 'expense').length}
              </span>
            </span>
          </button>
          <button
            onClick={() => setActiveTab('income')}
            disabled={isAnyLoading}
            className={`
              py-3 px-1 border-b-2 font-medium text-sm transition-colors
              ${activeTab === 'income'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            <span className="flex items-center gap-2">
              <span>📈</span>
              Доходы
              <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                {categories.filter(cat => cat.type === 'income').length}
              </span>
            </span>
          </button>
        </nav>
      </div>

      {/* Список категорий */}
      {isLoadingCategories ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <CategoryList
          categories={filteredCategories}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
          isLoading={isAnyLoading}
        />
      )}

      {/* Модальное окно */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        category={editingCategory}
        type={activeTab}
        isLoading={isCreating || isUpdating}
      />
    </div>
  )
}

