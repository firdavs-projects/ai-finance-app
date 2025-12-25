import { useState } from 'react'
import { Modal, Input, Button } from '@ai-finance/ui'
import type { Category, CreateCategoryDto } from '@entities/category'

interface CategoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateCategoryDto) => void
  category?: Category
  type: 'income' | 'expense'
  isLoading?: boolean
}

const EMOJI_OPTIONS = [
  '🍔', '☕', '🛒', '🚗', '🚕', '⛽', '🎬', '🛍️', '💊', '📱',
  '💰', '🎁', '💻', '🏠', '✈️', '🎓', '👕', '⚡', '💳', '📦',
  '🍕', '🥗', '🍺', '🎮', '🏋️', '🎵', '📚', '🐕', '🌳', '🎨'
]

const COLOR_OPTIONS = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e',
  '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
  '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#64748b'
]

export function CategoryModal({ isOpen, onClose, onSubmit, category, type, isLoading }: CategoryModalProps) {
  const [formData, setFormData] = useState<CreateCategoryDto>({
    name: category?.name || '',
    type,
    icon: category?.icon || '🍔',
    color: category?.color || '#3b82f6',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return
    onSubmit(formData)
  }

  const handleClose = () => {
    if (!isLoading) {
      setFormData({ name: '', type, icon: '🍔', color: '#3b82f6' })
      onClose()
    }
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, name: e.target.value })
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={category ? 'Редактировать категорию' : 'Новая категория'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Название */}
        <Input
          label="Название"
          value={formData.name}
          onChange={handleNameChange}
          placeholder="Введите название категории"
          required
          disabled={isLoading}
        />

        {/* Иконка */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Иконка
          </label>
          <div className="grid grid-cols-10 gap-2">
            {EMOJI_OPTIONS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setFormData({ ...formData, icon: emoji })}
                disabled={isLoading}
                className={`
                  w-10 h-10 text-2xl rounded-lg border-2 transition-all
                  hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed
                  ${formData.icon === emoji ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}
                `}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Цвет */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Цвет
          </label>
          <div className="grid grid-cols-9 gap-2">
            {COLOR_OPTIONS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setFormData({ ...formData, color })}
                disabled={isLoading}
                className={`
                  w-10 h-10 rounded-lg border-2 transition-all
                  hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed
                  ${formData.color === color ? 'border-gray-900 ring-2 ring-offset-2 ring-gray-900' : 'border-gray-200'}
                `}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Превью */}
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-2">Превью:</p>
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium"
            style={{ backgroundColor: formData.color }}
          >
            <span className="text-xl">{formData.icon}</span>
            <span>{formData.name || 'Название категории'}</span>
          </div>
        </div>

        {/* Кнопки */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={isLoading}
          >
            Отмена
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            disabled={!formData.name.trim()}
          >
            {category ? 'Сохранить' : 'Создать'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

