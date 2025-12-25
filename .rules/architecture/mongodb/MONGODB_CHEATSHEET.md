# MongoDB Quick Reference - Шпаргалка

## 🔑 Credentials

```
MongoDB Atlas: https://cloud.mongodb.com/
Project: ai-finance-bd
Project ID: 694d106421f035517bd0b06c
Database: ai-finance-bd
Username: firdavsabdulloev7725_db_user
Password: ml5opQDrSytbMA6p
```

---

## ⚡ Быстрые команды

### Запуск сервера
```bash
cd apps/backend
pnpm run dev
```

### Компиляция
```bash
cd apps/backend
pnpm run build
```

### Проверка подключения
```bash
curl http://localhost:3001/api/categories
```

---

## 📁 Важные файлы

### Конфигурация
- `apps/backend/.env` - переменные окружения (MONGODB_URI здесь!)
- `apps/backend/src/app.module.ts` - MongooseModule

### Схемы
- `apps/backend/src/modules/categories/schemas/category.schema.ts`
- `apps/backend/src/modules/accounts/schemas/account.schema.ts`
- `apps/backend/src/modules/transactions/schemas/transaction.schema.ts`

### Документация
- `MONGODB_INDEX.md` - навигация
- `MONGODB_QUICKSTART.md` - быстрый старт
- `MONGODB_SETUP.md` - полная инструкция

---

## 🔗 Полезные ссылки

- **Swagger UI**: http://localhost:3001/api/docs
- **MongoDB Atlas**: https://cloud.mongodb.com/
- **API Base**: http://localhost:3001/api

---

## 🛠️ API Endpoints

```
GET    /api/categories        - все категории
POST   /api/categories        - создать категорию
GET    /api/categories/:id    - одна категория
PATCH  /api/categories/:id    - обновить
DELETE /api/categories/:id    - удалить

GET    /api/accounts          - все счета
POST   /api/accounts          - создать счет
GET    /api/accounts/:id      - один счет

GET    /api/transactions      - все транзакции
POST   /api/transactions      - создать транзакцию
GET    /api/transactions/:id  - одна транзакция
DELETE /api/transactions/:id  - удалить

POST   /api/ai/parse-expense  - AI парсинг расходов
```

---

## 🐛 Troubleshooting

### Ошибка: querySrv ENOTFOUND
**Причина**: Неверный hostname в MONGODB_URI  
**Решение**: Получите правильный Connection String из MongoDB Atlas

### Ошибка: Authentication failed
**Причина**: Неверный username/password  
**Решение**: Проверьте credentials в Database Access

### Ошибка: Connection timeout
**Причина**: IP не в whitelist  
**Решение**: Добавьте IP в Network Access (или 0.0.0.0/0 для dev)

---

## 📦 Пакеты

```json
{
  "@nestjs/mongoose": "^11.0.4",
  "mongoose": "^9.0.2"
}
```

---

## 💡 Полезные заметки

1. **Автоинициализация**: Дефолтные данные создаются при первом запуске
2. **Timestamps**: Все документы имеют createdAt и updatedAt
3. **Populate**: Транзакции автоматически загружают связанные категории и счета
4. **Валидация**: Используется class-validator в DTO

---

## 🎯 Формат Connection String

```
mongodb+srv://<username>:<password>@<cluster-hostname>/<database>?retryWrites=true&w=majority
```

**Пример**:
```
mongodb+srv://firdavsabdulloev7725_db_user:ml5opQDrSytbMA6p@cluster0.xxxxx.mongodb.net/ai-finance-bd?retryWrites=true&w=majority
```

---

**Сохраните этот файл для быстрого доступа к важной информации!**

