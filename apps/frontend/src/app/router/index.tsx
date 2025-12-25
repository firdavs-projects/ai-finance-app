import { Routes, Route } from 'react-router-dom'
import { MainLayout } from '@widgets/layouts/MainLayout'
import { HomePage } from '@pages/home'
import { TransactionsPage } from '@pages/transactions'
import { AccountsPage } from '@pages/accounts'
import { AnalyticsPage } from '@pages/analytics'
import { SettingsPage } from '@pages/settings'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="accounts" element={<AccountsPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  )
}

