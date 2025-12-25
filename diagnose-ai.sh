#!/bin/bash

echo "🔧 Пошаговая диагностика AI Parser"
echo "===================================="
echo ""

# Шаг 1: Проверка .env файла
echo "Шаг 1: Проверка OPENAI_API_KEY в .env"
if [ -f "apps/backend/.env" ]; then
    if grep -q "OPENAI_API_KEY=" apps/backend/.env; then
        KEY=$(grep "OPENAI_API_KEY=" apps/backend/.env | cut -d'=' -f2)
        if [ -n "$KEY" ]; then
            echo "✅ OPENAI_API_KEY найден: ${KEY:0:10}..."
        else
            echo "❌ OPENAI_API_KEY пустой!"
            exit 1
        fi
    else
        echo "❌ OPENAI_API_KEY не найден в .env!"
        exit 1
    fi
else
    echo "❌ Файл .env не найден!"
    exit 1
fi

echo ""
echo "Шаг 2: Проверка MongoDB URI"
if grep -q "MONGODB_URI=" apps/backend/.env; then
    echo "✅ MONGODB_URI найден"
else
    echo "❌ MONGODB_URI не найден!"
    exit 1
fi

echo ""
echo "Шаг 3: Проверка, запущен ли backend"
if lsof -ti:3001 > /dev/null 2>&1; then
    echo "✅ Backend запущен на порту 3001"

    echo ""
    echo "Шаг 4: Проверка API /categories"
    CATEGORIES=$(curl -s http://localhost:3001/api/categories)
    COUNT=$(echo "$CATEGORIES" | jq length 2>/dev/null || echo "0")
    if [ "$COUNT" -gt 0 ]; then
        echo "✅ API работает, категорий: $COUNT"
    else
        echo "⚠️  API вернул пустой список или ошибку"
        echo "Response: $CATEGORIES"
    fi

    echo ""
    echo "Шаг 5: Тестирование AI parse endpoint"
    echo "Отправка: тест 10смн"

    RESPONSE=$(curl -s -X POST http://localhost:3001/api/ai/parse \
      -H "Content-Type: application/json" \
      -d '{"text": "тест 10смн"}')

    echo "Response:"
    echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"

    if echo "$RESPONSE" | grep -q '"success":true'; then
        echo ""
        echo "✅ AI парсинг работает!"
    else
        echo ""
        echo "❌ AI парсинг не работает"
        echo "Проверьте логи backend в терминале где он запущен"
    fi

else
    echo "❌ Backend НЕ запущен!"
    echo ""
    echo "Запустите backend командой:"
    echo "  cd /Users/firdavsabdulloev/Alif/ai-app"
    echo "  yarn dev:backend"
    echo ""
    echo "Или через npm в папке backend:"
    echo "  cd apps/backend"
    echo "  npm run dev"
fi

echo ""
echo "===================================="
echo "Диагностика завершена"

