# 📡 API Reference - Справочник API

## 🌐 Базовая информация

- **Base URL**: `http://localhost:3001/api`
- **Format**: JSON
- **Authentication**: Пока не требуется (v1.0.0)
- **Swagger UI**: http://localhost:3001/api/docs

---

## 🤖 AI Module

### Parse Expense (Главная функция)

Парсит текст на естественном языке и создаёт транзакции.

**Endpoint**: `POST /api/ai/parse`

**Request Body**:
```json
{
  "text": "американо 22сом и чизкейк 15сом",
  "accountId": "cash-default"  // опционально
}
```

**Response (Success)**:
```json
{
  "success": true,
  "transactions": [
    {
      "id": "uuid",
      "type": "expense",
      "amount": 22,
      "currency": "KGS",
      "categoryId": "cafe",
      "accountId": "cash-default",
      "description": "американо",
      "date": "2024-12-25T10:00:00.000Z",
      "createdAt": "2024-12-25T10:00:00.000Z"
    },
    {
      "id": "uuid",
      "type": "expense",
      "amount": 15,
      "currency": "KGS",
      "categoryId": "cafe",
      "accountId": "cash-default",
      "description": "чизкейк",
      "date": "2024-12-25T10:00:00.000Z",
      "createdAt": "2024-12-25T10:00:00.000Z"
    }
  ],
  "message": "Создано 2 транзакций"
}
```

**Response (Clarification Needed)**:
```json
{
  "success": false,
  "needsClarification": true,
  "question": "Из какого счёта списать средства: наличные или карта?"
}
```

**Response (Error)**:
```json
{
  "success": false,
  "error": "Не удалось распознать текст. Попробуйте переформулировать."
}
```

**Validation**:
- `text` - обязательное поле, строка
- `accountId` - опционально, строка (UUID)

**Примеры запросов**:
```
"выпил кофе за 25 сомов"
"такси 50 сомов"
"зарплата 50000 сомов"
"купил продукты: молоко 80, хлеб 20, яйца 60"
```

---

## 💸 Transactions Module

### Get All Transactions

**Endpoint**: `GET /api/transactions`

**Response**:
```json
[
  {
    "id": "uuid",
    "type": "expense",
    "amount": 100,
    "currency": "KGS",
    "categoryId": "food",
    "accountId": "cash-default",
    "description": "Продукты",
    "date": "2024-12-25T10:00:00.000Z",
    "createdAt": "2024-12-25T10:00:00.000Z"
  }
]
```

**Сортировка**: По дате (новые первыми)

---

### Create Transaction

**Endpoint**: `POST /api/transactions`

**Request Body**:
```json
{
  "type": "expense",          // "income" | "expense" | "transfer"
  "amount": 100,
  "currency": "KGS",          // опционально, по умолчанию "KGS"
  "categoryId": "food",
  "accountId": "cash-default",
  "description": "Продукты",  // опционально
  "date": "2024-12-25"        // опционально, ISO string
}
```

**Response**:
```json
{
  "id": "uuid",
  "type": "expense",
  "amount": 100,
  "currency": "KGS",
  "categoryId": "food",
  "accountId": "cash-default",
  "description": "Продукты",
  "date": "2024-12-25T00:00:00.000Z",
  "createdAt": "2024-12-25T10:00:00.000Z"
}
```

**Validation**:
- `type` - обязательно, enum: "income" | "expense" | "transfer"
- `amount` - обязательно, число > 0
- `categoryId` - обязательно, строка
- `accountId` - обязательно, строка

---

### Get Transaction by ID

**Endpoint**: `GET /api/transactions/:id`

**Parameters**:
- `id` - UUID транзакции

**Response**:
```json
{
  "id": "uuid",
  "type": "expense",
  "amount": 100,
  "currency": "KGS",
  "categoryId": "food",
  "accountId": "cash-default",
  "description": "Продукты",
  "date": "2024-12-25T00:00:00.000Z",
  "createdAt": "2024-12-25T10:00:00.000Z"
}
```

**Error (404)**:
```json
{
  "statusCode": 404,
  "message": "Transaction not found"
}
```

---

### Delete Transaction

**Endpoint**: `DELETE /api/transactions/:id`

**Parameters**:
- `id` - UUID транзакции

**Response**:
```json
true  // успех
```

---

## 💳 Accounts Module

### Get All Accounts

**Endpoint**: `GET /api/accounts`

**Response**:
```json
[
  {
    "id": "cash-default",
    "name": "Наличные",
    "type": "cash",
    "balance": 0,
    "currency": "KGS",
    "icon": "💵"
  },
  {
    "id": "card-default",
    "name": "Банковская карта",
    "type": "card",
    "balance": 0,
    "currency": "KGS",
    "icon": "💳"
  }
]
```

**Предустановленные счета**: 2 (Наличные, Карта)

---

### Create Account

**Endpoint**: `POST /api/accounts`

**Request Body**:
```json
{
  "name": "Сбережения",
  "type": "savings",          // "cash" | "card" | "bank" | "savings"
  "balance": 10000,           // опционально, по умолчанию 0
  "currency": "KGS",          // опционально, по умолчанию "KGS"
  "color": "#4CAF50",         // опционально
  "icon": "🐷"                // опционально
}
```

**Response**:
```json
{
  "id": "uuid",
  "name": "Сбережения",
  "type": "savings",
  "balance": 10000,
  "currency": "KGS",
  "color": "#4CAF50",
  "icon": "🐷"
}
```

**Validation**:
- `name` - обязательно, строка
- `type` - обязательно, enum: "cash" | "card" | "bank" | "savings"
- `balance` - опционально, число >= 0

---

### Get Account by ID

**Endpoint**: `GET /api/accounts/:id`

**Parameters**:
- `id` - UUID счёта

**Response**:
```json
{
  "id": "cash-default",
  "name": "Наличные",
  "type": "cash",
  "balance": 0,
  "currency": "KGS",
  "icon": "💵"
}
```

---

## 🏷️ Categories Module

### Get All Categories

**Endpoint**: `GET /api/categories`

**Response**:
```json
[
  {
    "id": "food",
    "name": "Еда",
    "type": "expense",
    "icon": "🍔"
  },
  {
    "id": "cafe",
    "name": "Кафе и рестораны",
    "type": "expense",
    "icon": "☕",
    "parentId": "food"
  },
  {
    "id": "salary",
    "name": "Зарплата",
    "type": "income",
    "icon": "💰"
  }
]
```

**Предустановленные категории**: 13

**Расходы**:
- 🍔 Еда (+ подкатегории: ☕ Кафе, 🛒 Продукты)
- 🚗 Транспорт (+ подкатегории: 🚕 Такси, ⛽ Топливо)
- 🎬 Развлечения
- 🛍️ Покупки
- 💊 Здоровье
- 📱 Счета и услуги

**Доходы**:
- 💰 Зарплата
- 🎁 Бонус
- 💻 Фриланс

---

### Create Category

**Endpoint**: `POST /api/categories`

**Request Body**:
```json
{
  "name": "Образование",
  "type": "expense",          // "income" | "expense"
  "icon": "📚",              // опционально
  "color": "#2196F3",        // опционально
  "parentId": "uuid"         // опционально, для подкатегории
}
```

**Response**:
```json
{
  "id": "uuid",
  "name": "Образование",
  "type": "expense",
  "icon": "📚",
  "color": "#2196F3"
}
```

**Validation**:
- `name` - обязательно, строка
- `type` - обязательно, enum: "income" | "expense"

---

## 🔍 Типы данных

### Transaction

```typescript
interface Transaction {
  id: string;                           // UUID
  type: 'income' | 'expense' | 'transfer';
  amount: number;                       // > 0
  currency: string;                     // ISO код (KGS, USD, etc)
  categoryId: string;                   // UUID категории
  accountId: string;                    // UUID счёта
  description?: string;                 // Описание
  date: Date;                           // Дата транзакции
  createdAt: Date;                      // Дата создания
}
```

### Account

```typescript
interface Account {
  id: string;                           // UUID
  name: string;                         // Название
  type: 'cash' | 'card' | 'bank' | 'savings';
  balance: number;                      // Текущий баланс
  currency: string;                     // ISO код
  color?: string;                       // Hex цвет
  icon?: string;                        // Emoji или иконка
}
```

### Category

```typescript
interface Category {
  id: string;                           // UUID
  name: string;                         // Название
  type: 'income' | 'expense';           // Тип
  icon?: string;                        // Emoji
  color?: string;                       // Hex цвет
  parentId?: string;                    // UUID родительской категории
}
```

---

## ⚡ Коды ответов

### Успешные

- `200 OK` - Успешный запрос
- `201 Created` - Ресурс создан

### Ошибки клиента

- `400 Bad Request` - Невалидные данные
- `404 Not Found` - Ресурс не найден

### Ошибки сервера

- `500 Internal Server Error` - Ошибка сервера

---

## 🔐 Аутентификация (Планируется v2.0.0)

В текущей версии (v1.0.0) аутентификация отсутствует.

**Планируется**:
- JWT tokens
- Refresh tokens
- OAuth 2.0 (Google, Facebook)

---

## 📊 Rate Limiting (Планируется v2.0.0)

В текущей версии лимиты отсутствуют.

**Планируется**:
- 100 запросов/минуту для AI endpoint
- 1000 запросов/минуту для остальных

---

## 🧪 Тестирование API

### Через Swagger UI

1. Откройте http://localhost:3001/api/docs
2. Выберите endpoint
3. Нажмите "Try it out"
4. Заполните параметры
5. Нажмите "Execute"

### Через curl

```bash
# Get all transactions
curl http://localhost:3001/api/transactions

# Create transaction
curl -X POST http://localhost:3001/api/transactions \
  -H "Content-Type: application/json" \
  -d '{"type":"expense","amount":100,"categoryId":"food","accountId":"cash-default"}'

# AI Parse
curl -X POST http://localhost:3001/api/ai/parse \
  -H "Content-Type: application/json" \
  -d '{"text":"кофе 25 сомов"}'
```

### Через Postman

1. Import Collection: http://localhost:3001/api/docs-json
2. Выберите endpoint
3. Настройте параметры
4. Send

---

## 🔄 Версионирование (Планируется v2.0.0)

**Текущая версия**: v1.0.0 (без версионирования в URL)

**Планируется**:
```
/api/v1/transactions
/api/v2/transactions
```

---

## 📝 Changelog

### v1.0.0 (25 декабря 2024)
- ✅ AI парсинг через OpenAI
- ✅ CRUD для транзакций
- ✅ CRUD для счетов
- ✅ CRUD для категорий
- ✅ Swagger документация
- ✅ In-memory storage

### Планируется v2.0.0
- 🔜 Аутентификация (JWT)
- 🔜 База данных (PostgreSQL/MongoDB)
- 🔜 Версионирование API
- 🔜 Rate limiting
- 🔜 Пагинация
- 🔜 Фильтрация и сортировка
- 🔜 Поиск
- 🔜 Экспорт данных (CSV, Excel)

---

**Версия API**: 1.0.0  
**Последнее обновление**: 25 декабря 2024

