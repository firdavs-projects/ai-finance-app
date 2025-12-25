import { NavLink } from 'react-router-dom'
import {
  HomeIcon,
  BanknotesIcon,
  CreditCardIcon,
  ChartBarIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline'
import {
  HomeIcon as HomeIconSolid,
  BanknotesIcon as BanknotesIconSolid,
  CreditCardIcon as CreditCardIconSolid,
  ChartBarIcon as ChartBarIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
} from '@heroicons/react/24/solid'

const navItems = [
  { to: '/', icon: HomeIcon, iconActive: HomeIconSolid, label: 'Главная' },
  { to: '/transactions', icon: BanknotesIcon, iconActive: BanknotesIconSolid, label: 'Операции' },
  { to: '/accounts', icon: CreditCardIcon, iconActive: CreditCardIconSolid, label: 'Счета' },
  { to: '/analytics', icon: ChartBarIcon, iconActive: ChartBarIconSolid, label: 'Аналитика' },
  { to: '/settings', icon: Cog6ToothIcon, iconActive: Cog6ToothIconSolid, label: 'Настройки' },
]

export function BottomNavigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 safe-area-pb">
      <div className="flex justify-around items-center max-w-lg mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center px-3 py-1 rounded-lg transition-colors ${
                isActive
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`
            }
          >
            {({ isActive }) => {
              const Icon = isActive ? item.iconActive : item.icon
              return (
                <>
                  <Icon className="h-6 w-6" />
                  <span className="text-xs mt-0.5">{item.label}</span>
                </>
              )
            }}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

