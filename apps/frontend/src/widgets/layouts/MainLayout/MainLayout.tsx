import { Outlet } from 'react-router-dom'
import { BottomNavigation } from '../BottomNavigation'
import { AiInputWidget } from '@widgets/ai-input'

export function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">AI Finance</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-32">
        <Outlet />
      </main>

      {/* AI Input (всегда видимый) */}
      <AiInputWidget />

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  )
}
