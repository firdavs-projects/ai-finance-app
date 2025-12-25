# 🚀 Quick Reference - Быстрый доступ к документации

## 🤖 Для AI помощников

### Начало каждой сессии:
```
1. Прочитай: .rules/AI_SESSION_INIT.md
2. Прочитай: .rules/INDEX.md
3. Прочитай: .rules/architecture/AI_INSTRUCTIONS.md
4. Прочитай: .rules/ai-reports/CURRENT_HANDOFF_NOTES.md
5. Начинай работу
```

### Быстрые команды:
```bash
# Инициализация
read_file .rules/AI_SESSION_INIT.md

# Навигация
read_file .rules/INDEX.md

# Правила
read_file .rules/architecture/AI_INSTRUCTIONS.md

# Текущее состояние
read_file .rules/ai-reports/CURRENT_HANDOFF_NOTES.md
```

---

## 📚 Для разработчиков

### Установка и запуск:
```
.rules/business/GETTING_STARTED.md
```

### MongoDB настройка:
```
.rules/architecture/mongodb/MONGODB_QUICKSTART.md
```

### Структура проекта:
```
.rules/architecture/PROJECT_STRUCTURE.md
```

### API справочник:
```
.rules/architecture/API_REFERENCE.md
```

---

## 📁 Структура .rules/

```
.rules/
├── AI_SESSION_INIT.md          🤖 Для AI - начни здесь!
├── INDEX.md                    🗺️ Карта документации
│
├── business/                   📘 Руководства
│   ├── GETTING_STARTED.md
│   ├── README.md
│   └── QUICKSTART.md
│
├── architecture/               🏗️ Техническое
│   ├── AI_INSTRUCTIONS.md
│   ├── PROJECT_STRUCTURE.md
│   ├── API_REFERENCE.md
│   ├── CODING_STANDARDS.md
│   └── mongodb/
│       ├── MONGODB_INDEX.md
│       ├── MONGODB_QUICKSTART.md
│       └── ...
│
└── ai-reports/                 📋 Отчеты
    ├── CURRENT_HANDOFF_NOTES.md
    ├── DOCUMENTATION_REORGANIZATION_2025.md
    └── ...
```

---

## 🎯 Правила

### ✅ ДЕЛАЙ:
- Храни документацию в `.rules/`
- Категоризируй правильно
- Создавай отчеты после задач
- Обновляй INDEX.md
- Читай AI_SESSION_INIT.md в начале сессии

### ❌ НЕ ДЕЛАЙ:
- MD файлы в корне (кроме README.md)
- Документацию вне `.rules/`
- Игнорировать AI_SESSION_INIT.md

---

**Версия**: 1.0.0  
**Дата**: 25 декабря 2025

