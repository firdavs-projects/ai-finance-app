#!/bin/bash

# Тестовый скрипт для проверки AI парсера

echo "🧪 Testing AI Parser..."
echo ""

# Проверка доступности API
echo "1. Checking API availability..."
curl -s http://localhost:3001/api/categories > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Backend is running"
else
    echo "❌ Backend is not responding. Please start it with: yarn dev:backend"
    exit 1
fi

echo ""
echo "2. Testing AI parse endpoint..."
echo "Request: американо 25смн и чизкейк 15смн"
echo ""

# Отправка тестового запроса
response=$(curl -s -X POST http://localhost:3001/api/ai/parse \
  -H "Content-Type: application/json" \
  -d '{"text": "американо 25смн и чизкейк 15смн"}')

echo "Response:"
echo "$response" | jq '.' 2>/dev/null || echo "$response"

echo ""
echo "3. Checking result..."

# Проверка успешности
if echo "$response" | grep -q '"success":true'; then
    echo "✅ AI parsing successful!"
    transactions_count=$(echo "$response" | jq '.transactions | length' 2>/dev/null || echo "?")
    echo "📊 Created $transactions_count transactions"
else
    echo "❌ AI parsing failed"
    error=$(echo "$response" | jq -r '.error' 2>/dev/null || echo "Unknown error")
    echo "Error: $error"
fi

echo ""
echo "Done!"

