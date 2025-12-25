# Исправление ошибок React и трансформации ID в MongoDB

**Дата**: 25 декабря 2025  
**Автор**: GitHub Copilot AI  
**Тип**: BUGFIX  
**Приоритет**: Критический

---

## 📋 Описание проблемы

В приложении возникли следующие ошибки:

### 1. **React Key Prop Warning**
```
Warning: Each child in a list should have a unique "key" prop.
Check the render method of `CategoryList` and `TransactionsPage`.
```

### 2. **React Child Object Error**
```
Uncaught Error: Objects are not valid as a React child 
(found: object with keys {_id, name, balance, currency, type, icon, __v, createdAt, updatedAt}).
```

### 3. **Несоответствие полей ID**
- Backend (MongoDB) возвращал `_id` (ObjectId)
- Frontend ожидал `id` (string)
- Это приводило к ошибкам при попытке отрендерить объект Account целиком

---

## 🔍 Анализ корневой причины

### Корневая причина #1: Отсутствие трансформации MongoDB документов
MongoDB по умолчанию возвращает:
- `_id` как ObjectId
- `__v` (версия документа)
- Внешние ключи как ObjectId

Frontend TypeScript интерфейсы ожидают:
- `id` как string
- Без `__v` и `_id`
- Внешние ключи как string

### Корневая причина #2: Неправильная обработка Account в getAccountName
Функция могла вернуть id вместо имени, что приводило к попытке отрендерить объект.

### Корневая причина #3: Неполная схема Transaction
В схеме отсутствовали поля: `place`, `person`, `comment`, `currency`, `accountToId`, `debtSubType`, которые были в DTO.

---

## ✅ Решение

### 1. Добавлена трансформация в Mongoose схемы

**Account Schema** (`apps/backend/src/modules/accounts/schemas/account.schema.ts`):
```typescript
@Schema({
  timestamps: true,
  toJSON: {
    transform: (_doc: any, ret: any) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
})
```

**Category Schema** (`apps/backend/src/modules/categories/schemas/category.schema.ts`):
- Аналогичная трансформация добавлена

**Transaction Schema** (`apps/backend/src/modules/transactions/schemas/transaction.schema.ts`):
```typescript
@Schema({
  timestamps: true,
  toJSON: {
    transform: (_doc: any, ret: any) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      // Преобразование ObjectId в строки для внешних ключей
      if (ret.categoryId) ret.categoryId = ret.categoryId.toString();
      if (ret.accountId) ret.accountId = ret.accountId.toString();
      if (ret.accountToId) ret.accountToId = ret.accountToId.toString();
      return ret;
    },
  },
})
```

### 2. Обновлена схема Transaction

Добавлены недостающие поля:
```typescript
@Prop({ default: 'TJS' })
currency?: string;

@Prop()
place?: string;

@Prop()
person?: string;

@Prop()
comment?: string;

@Prop({ type: Types.ObjectId, ref: 'Account' })
accountToId?: Types.ObjectId;

@Prop()
debtSubType?: 'i_gave' | 'i_returned' | 'they_gave' | 'they_returned';
```

Обновлен тип транзакции:
```typescript
type: 'income' | 'expense' | 'transfer' | 'debt';
```

Сделано categoryId опциональным:
```typescript
@Prop({ type: Types.ObjectId, ref: 'Category' })
categoryId?: Types.ObjectId;
```

### 3. Исправлена функция getAccountName

**TransactionsPage.tsx**:
```typescript
const getAccountName = (id: string) => {
  const account = accounts.find(a => a.id === id)
  return account ? `${account.icon || ''} ${account.name}` : 'Неизвестный счет'
}
```

Изменения:
- Добавлен fallback для `account.icon` (может быть undefined)
- Изменен fallback текст с `id` на `'Неизвестный счет'`

---

## 🧪 Тестирование

### Проверка API Endpoints

```bash
# Проверка Accounts
curl http://localhost:3001/api/accounts | jq '.[0] | keys'
# Результат: ["balance", "createdAt", "currency", "icon", "id", "name", "type", "updatedAt"]
# ✅ Поле "id" присутствует, "_id" и "__v" отсутствуют

# Проверка Categories
curl http://localhost:3001/api/categories | jq '.[0] | keys'
# ✅ Поле "id" присутствует

# Проверка Transactions
curl http://localhost:3001/api/transactions | jq '.[0] | keys'
# ✅ Поле "id" присутствует, внешние ключи преобразованы в строки
```

### Проверка Frontend
- ✅ React key warnings исчезли
- ✅ Ошибка "Objects are not valid as a React child" исчезла
- ✅ Компоненты корректно рендерят данные
- ✅ TypeScript ошибок нет

### Проверка Backend
```bash
cd apps/backend && pnpm build
# ✅ Сборка успешна, ошибок компиляции нет
```

---

## 📝 Измененные файлы

### Backend
1. `apps/backend/src/modules/accounts/schemas/account.schema.ts`
   - Добавлена toJSON трансформация
   
2. `apps/backend/src/modules/categories/schemas/category.schema.ts`
   - Добавлена toJSON трансформация
   
3. `apps/backend/src/modules/transactions/schemas/transaction.schema.ts`
   - Добавлена toJSON трансформация с преобразованием внешних ключей
   - Добавлены недостающие поля (place, person, comment, currency, accountToId, debtSubType)
   - Обновлен тип транзакции (добавлены 'transfer' и 'debt')
   - Сделано categoryId опциональным

### Frontend
4. `apps/frontend/src/pages/transactions/ui/TransactionsPage.tsx`
   - Исправлена функция getAccountName

---

## 🎯 Результат

### До исправления:
❌ Console warnings о missing key props  
❌ Runtime ошибки при рендеринге объектов  
❌ Несоответствие типов между backend и frontend  
❌ Неполная схема Transaction  

### После исправления:
✅ Нет warnings в консоли  
✅ Нет runtime ошибок  
✅ Полное соответствие типов  
✅ Все поля в Transaction схеме присутствуют  
✅ Автоматическая трансформация MongoDB документов в правильный формат  
✅ Backend собирается без ошибок  

---

## 💡 Лучшие практики

### 1. Всегда используйте toJSON трансформацию в Mongoose схемах
Это обеспечивает:
- Единообразный формат данных
- Автоматическое преобразование ObjectId → string
- Удаление служебных полей (`__v`, `_id`)

### 2. Синхронизация DTO и Schema
- Все поля из DTO должны присутствовать в схеме
- Типы должны совпадать
- Опциональность должна совпадать

### 3. Строгая типизация на Frontend
- Используйте точные типы вместо `any`
- Проверяйте наличие свойств перед использованием
- Добавляйте fallback значения для optional полей

---

## 🔗 Связанные документы

- `.rules/architecture/mongodb/MONGODB_QUICKSTART.md` - MongoDB интеграция
- `.rules/architecture/API_REFERENCE.md` - API документация
- `.rules/architecture/CODING_STANDARDS.md` - Стандарты кодирования

---

## ✨ Выводы

Проблема была вызвана несоответствием формата данных между MongoDB (использует `_id`) и Frontend (ожидает `id`). Решение через toJSON трансформацию в Mongoose схемах является стандартной и рекомендуемой практикой для NestJS + MongoDB приложений.

Дополнительно была обновлена схема Transaction для полного соответствия с DTO, что предотвратит будущие проблемы с отсутствующими полями.

**Статус**: ✅ ИСПРАВЛЕНО  
**Проверено**: Backend API, Frontend рендеринг, TypeScript компиляция

