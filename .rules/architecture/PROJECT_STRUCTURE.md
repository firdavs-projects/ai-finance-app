# 🏗️ Структура проекта AI Finance

## 📊 Общая архитектура

AI Finance построен как **монорепозиторий** с использованием **Yarn Workspaces**.

```
ai-finance-app/
├── .rules/                     # 📚 Документация (категоризированная)
│   ├── business/               # Бизнес-документация
│   ├── architecture/           # Техническая документация
│   └── ai-reports/             # Отчёты AI
│
├── apps/                       # 🚀 Приложения
│   ├── frontend/               # React + Vite + PWA
│   └── backend/                # NestJS + OpenAI
│
├── packages/                   # 📦 Shared пакеты
│   ├── ui/                     # UI библиотека
│   └── shared/                 # Общие типы
│
└── package.json                # Workspaces config
```

---

## 🎨 Frontend: Feature-Sliced Design (FSD)

### Структура

```
apps/frontend/src/
├── app/                        # 🔧 App - Инициализация приложения
│   ├── App.tsx                 # Корневой компонент
│   ├── router/                 # Роутинг
│   ├── store/                  # Redux store
│   └── styles/                 # Глобальные стили
│
├── pages/                      # 📄 Pages - Страницы
│   ├── home/                   # Главная страница
│   ├── transactions/           # Страница транзакций
│   ├── accounts/               # Страница счетов
│   ├── analytics/              # Страница аналитики
│   └── settings/               # Настройки
│
├── widgets/                    # 🧩 Widgets - Комплексные блоки
│   ├── layouts/
│   │   ├── MainLayout/         # Основной layout с навигацией
│   │   └── BottomNavigation/   # Нижняя навигация
│   └── ai-input/               # AI виджет для ввода расходов
│
├── features/                   # ⚡ Features - Функциональность
│   └── add-transaction/        # Добавление транзакции
│
├── entities/                   # 🎯 Entities - Бизнес-сущности
│   ├── transaction/            # Транзакция
│   ├── account/                # Счёт
│   └── category/               # Категория
│
└── shared/                     # 🔗 Shared - Переиспользуемое
    ├── api/                    # RTK Query API
    ├── ui/                     # UI компоненты (используется из @ai-finance/ui)
    └── lib/                    # Утилиты
```

### Правила FSD

1. **Слои изолированы**: Нижний слой не знает о верхнем
2. **Импорты только вниз**: `pages` → `widgets` → `features` → `entities` → `shared`
3. **Публичный API**: Каждый модуль экспортирует через `index.ts`
4. **Segment structure**: `ui/`, `model/`, `api/`, `lib/`

### Пример структуры feature:

```
features/add-transaction/
├── index.ts                    # Public API
├── ui/
│   └── AddTransactionForm.tsx  # UI компонент
├── model/
│   └── useAddTransaction.ts    # Логика
└── api/
    └── addTransactionApi.ts    # API запросы
```

---

## 🔧 Backend: NestJS модульная архитектура

### Структура

```
apps/backend/src/
├── main.ts                     # Entry point
├── app.module.ts               # Root module
│
└── modules/                    # 📦 Модули
    ├── ai/                     # 🤖 AI модуль (OpenAI)
    │   ├── ai.module.ts
    │   ├── ai.controller.ts
    │   ├── ai.service.ts
    │   └── dto/
    │       └── parse-expense.dto.ts
    │
    ├── transactions/           # 💸 Транзакции
    │   ├── transactions.module.ts
    │   ├── transactions.controller.ts
    │   ├── transactions.service.ts
    │   └── dto/
    │       └── create-transaction.dto.ts
    │
    ├── accounts/               # 💳 Счета
    │   ├── accounts.module.ts
    │   ├── accounts.controller.ts
    │   ├── accounts.service.ts
    │   └── dto/
    │       └── create-account.dto.ts
    │
    └── categories/             # 🏷️ Категории
        ├── categories.module.ts
        ├── categories.controller.ts
        ├── categories.service.ts
        └── dto/
            └── create-category.dto.ts
```

### Принципы модуля NestJS

1. **Module** - Определяет зависимости и экспорты
2. **Controller** - Обрабатывает HTTP запросы
3. **Service** - Содержит бизнес-логику
4. **DTO** - Валидация входных данных

### Dependency Injection

```typescript
@Module({
  imports: [TransactionsModule, CategoriesModule],  // Зависимости
  controllers: [AiController],                      // Контроллеры
  providers: [AiService],                           // Сервисы
  exports: [AiService],                             // Экспорт для других модулей
})
export class AiModule {}
```

---

## 📦 Shared пакеты

### packages/ui

UI библиотека на основе **Headless UI + Tailwind CSS**.

```
packages/ui/src/
├── components/
│   ├── Button.tsx              # Кнопка
│   ├── Input.tsx               # Поле ввода
│   ├── Card.tsx                # Карточка
│   ├── Badge.tsx               # Бейдж
│   └── Modal.tsx               # Модальное окно
└── utils/
    └── cn.ts                   # Утилита для className (clsx + tailwind-merge)
```

**Особенности:**
- Без состояния (stateless)
- Типизированные props
- Tailwind для стилей
- Peer dependencies: react, react-dom

### packages/shared

Общие типы и константы для frontend и backend.

```
packages/shared/src/
├── types/
│   └── index.ts                # Transaction, Account, Category, API types
└── constants/
    └── index.ts                # CURRENCIES, CATEGORY_ICONS, etc
```

**Использование:**
```typescript
import { Transaction, CURRENCIES } from '@ai-finance/shared';
```

---

## 🔄 Потоки данных

### Frontend → Backend

```mermaid
User Input (AI Widget)
    ↓
RTK Query (baseApi)
    ↓
POST /api/ai/parse
    ↓
NestJS (AiController)
    ↓
AiService → OpenAI GPT-4
    ↓
TransactionsService.create()
    ↓
Response → Frontend
    ↓
Update UI
```

### Типичный запрос

```typescript
// Frontend (RTK Query)
const { data } = useParseExpenseMutation({
  text: "американо 22сом",
  accountId: "cash-default"
});

// Backend обрабатывает через:
// 1. AiController → validation (DTO)
// 2. AiService → OpenAI API
// 3. TransactionsService → создание записей
// 4. Response → Frontend
```

---

## 🗄️ Хранение данных

### Текущая архитектура (v1.0.0)

**In-Memory Storage** - Все данные хранятся в памяти (массивы в сервисах).

```typescript
@Injectable()
export class TransactionsService {
  private transactions: Transaction[] = [];  // In-memory
  
  create(dto: CreateTransactionDto): Transaction {
    const transaction = { id: crypto.randomUUID(), ...dto };
    this.transactions.push(transaction);
    return transaction;
  }
}
```

**Предустановленные данные:**
- 2 счёта (Наличные, Карта)
- 13 категорий (Еда, Транспорт, etc)

### Будущая архитектура (v2.0.0+)

Планируется добавить:
- **PostgreSQL** или **MongoDB** для хранения
- **Prisma** или **TypeORM** для ORM
- **Redis** для кэширования
- **Миграции** для схемы БД

---

## 🌐 API структура

### Соглашения

- **Prefix**: `/api`
- **Версионирование**: Пока не используется (добавить в v2.0.0)
- **Формат**: JSON
- **Аутентификация**: Пока нет (добавить JWT в v2.0.0)

### Эндпоинты

```
/api/ai/parse              # POST - AI парсинг
/api/transactions          # GET, POST
/api/transactions/:id      # GET, DELETE
/api/accounts              # GET, POST
/api/accounts/:id          # GET
/api/categories            # GET, POST
/api/docs                  # GET - Swagger UI
```

Подробнее см. [API_REFERENCE.md](./API_REFERENCE.md)

---

## 🔐 Конфигурация

### Environment Variables

**Backend** (`apps/backend/.env`):
```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
OPENAI_API_KEY=sk-your-key-here        # ОБЯЗАТЕЛЬНО!
```

**Frontend** (`apps/frontend/.env`):
```env
VITE_API_URL=http://localhost:3001/api
```

### TypeScript Configuration

**Frontend** - ES Modules, React JSX:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "jsx": "react-jsx",
    "moduleResolution": "bundler"
  }
}
```

**Backend** - CommonJS, Decorators:
```json
{
  "compilerOptions": {
    "target": "ES2021",
    "module": "commonjs",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

---

## 🚀 Сборка и развёртывание

### Development

```bash
yarn dev              # Всё сразу
yarn dev:frontend     # Только frontend (Vite)
yarn dev:backend      # Только backend (NestJS watch mode)
```

### Production Build

```bash
yarn build            # Всё
yarn build:frontend   # → apps/frontend/dist
yarn build:backend    # → apps/backend/dist
```

### Production Run

```bash
# Frontend - статика (serve или nginx)
cd apps/frontend/dist
npx serve

# Backend
cd apps/backend
yarn start:prod
```

---

## 📊 Технологический стек

### Frontend
- **React 18** - UI библиотека
- **TypeScript** - Типизация
- **Vite** - Сборщик
- **RTK Query** - Управление данными
- **React Router** - Роутинг
- **Tailwind CSS** - Стили
- **Headless UI** - Доступные компоненты
- **Vite PWA** - Progressive Web App

### Backend
- **NestJS** - Фреймворк
- **TypeScript** - Типизация
- **OpenAI** - AI интеграция
- **Swagger** - Документация API
- **class-validator** - Валидация
- **class-transformer** - Трансформация

### Tooling
- **Yarn** - Пакетный менеджер
- **ESLint** - Линтинг
- **Prettier** - Форматирование
- **TypeScript** - Компиляция

---

## 📝 Соглашения о коде

### Naming

- **Компоненты**: PascalCase (`UserProfile.tsx`)
- **Хуки**: camelCase с префиксом `use` (`useAuth.ts`)
- **Утилиты**: camelCase (`formatDate.ts`)
- **Константы**: UPPER_SNAKE_CASE (`MAX_LENGTH`)
- **Типы/Интерфейсы**: PascalCase (`User`, `ApiResponse`)

### Файловая структура

```typescript
// ✅ Хорошо
features/add-transaction/
├── index.ts                    // Public API
├── ui/AddTransactionForm.tsx
└── model/useAddTransaction.ts

// ❌ Плохо
features/AddTransaction.tsx     // Всё в одном файле
```

### Импорты

```typescript
// Порядок импортов:
// 1. React/библиотеки
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

// 2. Внутренние пакеты
import { Button } from '@ai-finance/ui';
import { Transaction } from '@ai-finance/shared';

// 3. Локальные
import { useAddTransaction } from './model';
```

---

**Версия**: 1.0.0  
**Последнее обновление**: 25 декабря 2024

