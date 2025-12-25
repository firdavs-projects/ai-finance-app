# AI Finance 💰🤖

Умное приложение для учёта личных финансов с возможностями ИИ в стиле ZenMoney.

## 🚀 Быстрый старт

```bash
# Установка зависимостей
yarn install

# Настройка окружения
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env

# Настройте переменные окружения в apps/backend/.env:
# - OPENAI_API_KEY - ключ API OpenAI
# - MONGODB_URI - строка подключения к MongoDB Atlas

# Запуск приложения
yarn dev              # frontend + backend
# ИЛИ
yarn dev:frontend     # только frontend (localhost:5173)
yarn dev:backend      # только backend (localhost:3001)
```

> 📌 **MongoDB подключение**: См. [.rules/architecture/mongodb/MONGODB_QUICKSTART.md](.rules/architecture/mongodb/MONGODB_QUICKSTART.md)

## 🤖 Для AI помощников

**ВАЖНО**: Перед началом работы прочитай [.rules/AI_SESSION_INIT.md](.rules/AI_SESSION_INIT.md)

Этот файл содержит обязательный чек-лист инициализации сессии.

## 📚 Документация

Вся документация проекта находится в папке **`.rules/`** и разделена по категориям:

**→ [📋 Индекс документации](.rules/INDEX.md)** - Начните отсюда!

### Категории:

**📘 Бизнес** (для пользователей и разработчиков):
- [GETTING_STARTED.md](.rules/business/GETTING_STARTED.md) - Установка и запуск
- [README.md](.rules/business/README.md) - Общее описание проекта

**🏗️ Архитектура** (техническая документация):
- [AI_INSTRUCTIONS.md](.rules/architecture/AI_INSTRUCTIONS.md) - Инструкции для AI
- [PROJECT_STRUCTURE.md](.rules/architecture/PROJECT_STRUCTURE.md) - Структура проекта
- [API_REFERENCE.md](.rules/architecture/API_REFERENCE.md) - Справочник API

**📋 Отчёты AI** (история изменений):
- [BACKEND_STATUS.md](.rules/ai-reports/BACKEND_STATUS.md) - Статус бэкенда
- [YARN_MIGRATION.md](.rules/ai-reports/YARN_MIGRATION.md) - Миграция на Yarn
- [DOCUMENTATION_MIGRATION.md](.rules/ai-reports/DOCUMENTATION_MIGRATION.md) - Реорганизация

## 🤖 AI Функционал

Введите в поле внизу экрана:
```
американо 22смн, чизкейк 15смн
```

AI автоматически распознает транзакции, категории и суммы.

## 🛠️ Технологии

- **Frontend**: React, Vite, PWA, RTK Query, Tailwind CSS, FSD
- **Backend**: NestJS, OpenAI GPT-4o-mini, Swagger
- **Database**: MongoDB Atlas + Mongoose
- **UI Library**: Headless UI + Tailwind
- **Monorepo**: Yarn Workspaces

## 📖 Подробнее

Полная документация: [.rules/](.rules/)

### 🗄️ MongoDB Setup

Настройка базы данных MongoDB Atlas:
- **[MONGODB_INDEX.md](MONGODB_INDEX.md)** - навигация по документации
- **[MONGODB_QUICKSTART.md](MONGODB_QUICKSTART.md)** - быстрый старт
- **[MONGODB_CHEATSHEET.md](MONGODB_CHEATSHEET.md)** - шпаргалка с командами

---

**Разработка**: AI Finance Team | **Версия**: 1.0.0

