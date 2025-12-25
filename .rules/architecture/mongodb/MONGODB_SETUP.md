# Настройка MongoDB для AI Finance App

## Подключение к MongoDB Atlas

### Данные подключения
- **Username**: `firdavsabdulloev7725_db_user`
- **Password**: `ml5opQDrSytbMA6p`
- **Database**: `ai-finance-bd`
- **Project ID**: `694d106421f035517bd0b06c`
- **Project Name**: `ai-finance-bd`

### Шаги настройки

1. **Получение правильного Connection String**:
   - Откройте [MongoDB Atlas](https://cloud.mongodb.com/)
   - Войдите в свой проект `ai-finance-bd`
   - Перейдите в раздел **Database** → **Connect**
   - Выберите **Drivers**
   - Скопируйте Connection String

2. **Формат Connection String**:
   ```
   mongodb+srv://<username>:<password>@<cluster-hostname>/<database>?retryWrites=true&w=majority&appName=<app-name>
   ```

3. **Обновление .env файла**:
   - Откройте `/apps/backend/.env`
   - Замените `<cluster-hostname>` на правильный hostname из вашего MongoDB Atlas
   - Пример: `cluster0.xxxxx.mongodb.net`

### Текущая конфигурация

Файл `.env` уже содержит базовую конфигурацию:
```env
MONGODB_URI=mongodb+srv://firdavsabdulloev7725_db_user:ml5opQDrSytbMA6p@cluster0.vdgxk.mongodb.net/ai-finance-bd?retryWrites=true&w=majority&appName=Cluster0
MONGODB_PROJECT_ID=694d106421f035517bd0b06c
MONGODB_PROJECT_NAME=ai-finance-bd
```

**ВАЖНО**: Если hostname `cluster0.vdgxk.mongodb.net` неверный, замените его на правильный из MongoDB Atlas.

### Проверка подключения

После настройки запустите бэкенд:
```bash
cd apps/backend
pnpm run dev
```

При успешном подключении вы увидите:
```
[Nest] LOG [NestFactory] Starting Nest application...
[Nest] LOG [InstanceLoader] MongooseModule dependencies initialized
🚀 Backend запущен на http://localhost:3001
📚 Swagger UI: http://localhost:3001/api/docs
```

### Структура базы данных

После подключения автоматически создаются:

#### Collections:
1. **categories** - категории транзакций
   - Автоматически заполняется дефолтными категориями при первом запуске
   
2. **accounts** - счета пользователя
   - Автоматически создаются "Наличные" и "Банковская карта"
   
3. **transactions** - транзакции
   - Создаются пользователем через API

### Возможные проблемы

#### Ошибка: `querySrv ENOTFOUND`
**Причина**: Неверный hostname в Connection String

**Решение**:
1. Проверьте правильность hostname в MongoDB Atlas
2. Убедитесь, что кластер активен
3. Проверьте Network Access в MongoDB Atlas (ваш IP должен быть в whitelist)

#### Ошибка: `Authentication failed`
**Причина**: Неверные credentials

**Решение**:
1. Проверьте username и password
2. Убедитесь, что пользователь создан в Database Access

#### Ошибка: `Connection timeout`
**Причина**: Сетевые ограничения

**Решение**:
1. Добавьте свой IP в Network Access (или разрешите доступ откуда угодно `0.0.0.0/0` для разработки)
2. Проверьте firewall и proxy настройки

### API Endpoints

После успешного подключения доступны следующие endpoints:

- `GET /api/categories` - получить все категории
- `POST /api/categories` - создать категорию
- `GET /api/accounts` - получить все счета
- `POST /api/accounts` - создать счет
- `GET /api/transactions` - получить все транзакции
- `POST /api/transactions` - создать транзакцию

Полная документация: http://localhost:3001/api/docs

### Дополнительная информация

- [MongoDB Atlas Documentation](https://www.mongodb.com/docs/atlas/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [NestJS Mongoose Integration](https://docs.nestjs.com/techniques/mongodb)

