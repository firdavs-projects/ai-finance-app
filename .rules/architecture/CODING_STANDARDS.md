# 📝 Coding Standards - Стандарты кодирования

**Проект**: AI Finance  
**Версия**: 1.0.0  
**Дата**: 25 декабря 2024

---

## 🎯 Общие принципы

1. **KISS** (Keep It Simple, Stupid) - Пиши просто
2. **DRY** (Don't Repeat Yourself) - Не повторяйся
3. **YAGNI** (You Aren't Gonna Need It) - Не усложняй заранее
4. **SOLID** - Следуй принципам ООП
5. **Code for humans** - Код для людей, не для машин

---

## 📛 Naming Conventions

### Файлы и папки

```
✅ Хорошо:
components/
  UserProfile.tsx          # PascalCase для компонентов
  Button.tsx
hooks/
  useAuth.ts               # camelCase с префиксом use
  useLocalStorage.ts
utils/
  formatDate.ts            # camelCase для утилит
  parseAmount.ts
types/
  index.ts                 # Типы в index.ts
constants/
  apiRoutes.ts             # camelCase для констант файлов
```

### Переменные и функции

```typescript
// Компоненты - PascalCase
function HomePage() {}
const Button = () => {}  // ❌ Избегай для компонентов

// Хуки - camelCase с use
function useAuth() {}
const useLocalStorage = () => {}

// Обычные функции - camelCase
function calculateTotal() {}
const formatCurrency = () => {}

// Константы - UPPER_SNAKE_CASE
const MAX_RETRIES = 3;
const API_BASE_URL = 'http://api.example.com';

// Переменные - camelCase
const userName = 'John';
let isLoading = false;

// Приватные поля (классы) - _camelCase
class User {
  private _password: string;
}

// Типы и Интерфейсы - PascalCase
type User = { name: string };
interface ApiResponse { data: any }
```

---

## ⚛️ React Components

### Стиль объявления компонентов

**✅ ИСПОЛЬЗУЙ: `export function`** (рекомендовано)

```typescript
// ✅ Отлично - function declaration
export function HomePage() {
  return <div>Home Page</div>
}

// ✅ Отлично - с типизированными пропсами
interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export function Button({ onClick, children, variant = 'primary' }: ButtonProps) {
  return (
    <button onClick={onClick} className={`btn-${variant}`}>
      {children}
    </button>
  )
}
```

**❌ ИЗБЕГАЙ: `export const`** для компонентов

```typescript
// ❌ Плохо - arrow function без типа
export const HomePage = () => {
  return <div>Home Page</div>
}

// ❌ Плохо - даже с React.FC
export const HomePage: React.FC = () => {
  return <div>Home Page</div>
}

// ⚠️ Допустимо только для HOC или специальных случаев
export const withAuth = (Component: React.ComponentType) => {
  return (props: any) => <Component {...props} />
}
```

### Почему `function` лучше:

1. ✅ **Рекомендация React Team** - официальная документация использует function
2. ✅ **DevTools** - имя компонента правильно отображается в React DevTools
3. ✅ **Stack Trace** - имя функции видно в стеке вызовов при ошибках
4. ✅ **Hoisting** - можно использовать до объявления (если нужно)
5. ✅ **Меньше кода** - не нужно указывать React.FC
6. ✅ **Проще читать** - явно видно что это компонент-функция

### Порядок в компоненте

```typescript
export function MyComponent({ prop1, prop2 }: MyComponentProps) {
  // 1. Хуки (всегда в одинаковом порядке)
  const [state, setState] = useState(initial);
  const dispatch = useDispatch();
  const { data } = useQuery();
  
  // 2. Вычисляемые значения
  const computedValue = useMemo(() => expensive(prop1), [prop1]);
  
  // 3. Обработчики событий
  const handleClick = () => {
    // ...
  };
  
  // 4. Effects (в конце хуков)
  useEffect(() => {
    // ...
  }, []);
  
  // 5. Early returns
  if (!data) return <Loading />;
  if (error) return <Error />;
  
  // 6. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

---

## 🎨 TypeScript

### Типизация

```typescript
// ✅ Явная типизация параметров
function formatCurrency(amount: number, currency: string): string {
  return `${amount} ${currency}`;
}

// ✅ Интерфейсы для объектов
interface User {
  id: string;
  name: string;
  email: string;
}

// ✅ Type для union и простых типов
type Status = 'idle' | 'loading' | 'success' | 'error';
type ID = string | number;

// ✅ Generics когда нужно
function identity<T>(value: T): T {
  return value;
}

// ❌ Избегай any
const data: any = getData();  // ❌ Плохо
const data: unknown = getData();  // ✅ Лучше
```

### Props типизация

```typescript
// ✅ Интерфейс для пропсов
interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export function Button({ children, onClick, variant = 'primary', disabled }: ButtonProps) {
  // ...
}

// ❌ Избегай inline типов
export function Button({ children, onClick }: { children: React.ReactNode, onClick: () => void }) {
  // ...
}
```

---

## 📦 Импорты

### Порядок импортов

```typescript
// 1. React и библиотеки (внешние зависимости)
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';

// 2. Внутренние пакеты (@workspace)
import { Button, Input } from '@ai-finance/ui';
import { Transaction, DEFAULT_CURRENCY } from '@ai-finance/shared';

// 3. Алиасы (@app, @pages, @widgets, etc)
import { useAppDispatch } from '@app/store';
import { HomePage } from '@pages/home';

// 4. Относительные импорты
import { useTransaction } from './hooks/useTransaction';
import { TransactionCard } from './components/TransactionCard';
import styles from './styles.module.css';

// 5. Типы (если отдельно)
import type { TransactionType } from './types';
```

### Группировка

```typescript
// ✅ Группируй логически
import { 
  useState, 
  useEffect, 
  useMemo, 
  useCallback 
} from 'react';

// ❌ Не смешивай
import { useState } from 'react';
import { Button } from '@ai-finance/ui';
import { useEffect } from 'react';  // ❌ React уже импортирован
```

---

## 🏗️ FSD (Feature-Sliced Design)

### Структура модуля

```typescript
// features/add-transaction/
// ├── index.ts                 // Public API
// ├── ui/
// │   └── AddTransactionForm.tsx
// ├── model/
// │   └── useAddTransaction.ts
// └── api/
//     └── addTransactionApi.ts

// index.ts - Public API (что экспортируем наружу)
export { AddTransactionForm } from './ui/AddTransactionForm';
export { useAddTransaction } from './model/useAddTransaction';
```

### Правила импортов в FSD

```typescript
// ✅ Можно импортировать из нижних слоёв
// pages -> widgets -> features -> entities -> shared
import { Button } from '@shared/ui';
import { Transaction } from '@entities/transaction';
import { AddTransactionForm } from '@features/add-transaction';

// ❌ Нельзя импортировать из верхних слоёв
// В entities нельзя импортировать из features
// В features нельзя импортировать из pages
```

---

## 🎯 Лучшие практики

### Компоненты

```typescript
// ✅ Маленькие, фокусированные компоненты
function UserAvatar({ url, name }: AvatarProps) {
  return <img src={url} alt={name} />;
}

// ✅ Деструктуризация пропсов
function Button({ onClick, children }: ButtonProps) {
  // ...
}

// ❌ Избегай props drilling
function GrandParent() {
  const data = useData();
  return <Parent data={data} />;  // ❌ Передаём через все уровни
}

// ✅ Используй контекст или состояние
function GrandParent() {
  return (
    <DataProvider>
      <Parent />
    </DataProvider>
  );
}
```

### Хуки

```typescript
// ✅ Кастомные хуки для логики
function useTransaction(id: string) {
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    fetchTransaction(id).then(setTransaction);
  }, [id]);
  
  return { transaction, loading };
}

// ✅ Используй в компоненте
function TransactionDetails({ id }: Props) {
  const { transaction, loading } = useTransaction(id);
  
  if (loading) return <Loading />;
  return <div>{transaction.amount}</div>;
}
```

### Условный рендеринг

```typescript
// ✅ Early returns для простоты
function UserProfile({ user }: Props) {
  if (!user) return <NotFound />;
  if (user.isBlocked) return <Blocked />;
  
  return <div>{user.name}</div>;
}

// ✅ Тернарный оператор для простых случаев
return isLoading ? <Loading /> : <Content />;

// ❌ Избегай глубокой вложенности
return (
  <div>
    {user ? (
      user.isActive ? (
        user.hasAccess ? (
          <Content />
        ) : <NoAccess />
      ) : <Inactive />
    ) : <NotFound />}
  </div>
);
```

---

## 🧪 Комментарии

```typescript
// ✅ Объясняй "почему", а не "что"
// Используем setTimeout чтобы избежать race condition с API
setTimeout(() => fetchData(), 100);

// ❌ Очевидные комментарии не нужны
// Устанавливаем loading в true
setLoading(true);  // ❌ Видно из кода

// ✅ TODO комментарии
// TODO: Добавить пагинацию когда будет > 100 транзакций
function TransactionList() {
  // ...
}

// ✅ JSDoc для публичного API
/**
 * Форматирует сумму в читаемый вид
 * @param amount - Сумма в числовом формате
 * @param currency - Код валюты (TJS, USD, etc)
 * @returns Отформатированная строка (например: "100 смн")
 */
export function formatAmount(amount: number, currency: string): string {
  // ...
}
```

---

## 🚫 Что избегать

### Anti-patterns

```typescript
// ❌ Мутация state напрямую
state.items.push(newItem);  // ❌
setState({ ...state, items: [...state.items, newItem] });  // ✅

// ❌ Забытые зависимости в useEffect
useEffect(() => {
  fetchData(userId);
}, []);  // ❌ userId отсутствует в deps

useEffect(() => {
  fetchData(userId);
}, [userId]);  // ✅

// ❌ Inline функции в JSX (если они сложные)
<button onClick={() => {
  // 20 строк логики  ❌
}}>Click</button>

// ✅ Вынеси в отдельную функцию
const handleClick = () => {
  // логика
};
<button onClick={handleClick}>Click</button>

// ❌ Слишком много логики в компоненте
function ComplexComponent() {
  // 200 строк логики  ❌
}

// ✅ Раздели на меньшие компоненты и хуки
function SimpleComponent() {
  const logic = useComplexLogic();  // ✅
  return <UI {...logic} />;
}
```

---

## ✅ Checklist перед commit

- [ ] Код следует стандартам именования
- [ ] Компоненты используют `export function`
- [ ] Импорты отсортированы правильно
- [ ] Нет console.log в production коде
- [ ] TypeScript типы корректны (нет any)
- [ ] Комментарии объясняют "почему"
- [ ] Код проходит ESLint
- [ ] Компоненты небольшие и фокусированные

---

**Версия**: 1.0.0  
**Последнее обновление**: 25 декабря 2024  
**Применяется к**: AI Finance Monorepo

