#!/bin/bash

# Тест AI парсера с распознаванием счетов

API_URL="http://localhost:3001/api"

echo "=== Тест AI парсера с распознаванием счетов ==="
echo ""

# Тест 1: "хлеб 25с наличными"
echo "📝 Тест 1: 'хлеб 25с наличными'"
RESPONSE=$(curl -s -X POST "${API_URL}/ai/parse" \
  -H "Content-Type: application/json" \
  -d '{"text": "хлеб 25с наличными"}')

echo "Ответ:"
echo "$RESPONSE" | jq '.'
echo ""

# Получаем ID созданной транзакции
TRANSACTION_ID=$(echo "$RESPONSE" | jq -r '.transactions[0].id // empty')

if [ ! -z "$TRANSACTION_ID" ]; then
  echo "✅ Транзакция создана с ID: $TRANSACTION_ID"

  # Проверяем детали транзакции
  TRANSACTION=$(curl -s "${API_URL}/transactions/$TRANSACTION_ID")
  ACCOUNT_ID=$(echo "$TRANSACTION" | jq -r '.accountId')

  echo "Счет транзакции ID: $ACCOUNT_ID"

  # Получаем информацию о счете
  ACCOUNT=$(curl -s "${API_URL}/accounts" | jq ".[] | select(.id == \"$ACCOUNT_ID\")")
  ACCOUNT_NAME=$(echo "$ACCOUNT" | jq -r '.name')
  ACCOUNT_TYPE=$(echo "$ACCOUNT" | jq -r '.type')

  echo "Счет: $ACCOUNT_NAME (тип: $ACCOUNT_TYPE)"

  if [ "$ACCOUNT_TYPE" == "cash" ]; then
    echo "✅ УСПЕХ: Счет правильно определен как 'наличные' (cash)"
  else
    echo "❌ ОШИБКА: Ожидался тип 'cash', получен '$ACCOUNT_TYPE'"
  fi
else
  echo "❌ ОШИБКА: Транзакция не создана"
  echo "Детали ошибки:"
  echo "$RESPONSE" | jq '.error // .message // .'
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Тест 2: "кофе 30смн картой"
echo "📝 Тест 2: 'кофе 30смн картой'"
RESPONSE=$(curl -s -X POST "${API_URL}/ai/parse" \
  -H "Content-Type: application/json" \
  -d '{"text": "кофе 30смн картой"}')

echo "Ответ:"
echo "$RESPONSE" | jq '.'
echo ""

TRANSACTION_ID=$(echo "$RESPONSE" | jq -r '.transactions[0].id // empty')

if [ ! -z "$TRANSACTION_ID" ]; then
  echo "✅ Транзакция создана с ID: $TRANSACTION_ID"

  TRANSACTION=$(curl -s "${API_URL}/transactions/$TRANSACTION_ID")
  ACCOUNT_ID=$(echo "$TRANSACTION" | jq -r '.accountId')

  ACCOUNT=$(curl -s "${API_URL}/accounts" | jq ".[] | select(.id == \"$ACCOUNT_ID\")")
  ACCOUNT_NAME=$(echo "$ACCOUNT" | jq -r '.name')
  ACCOUNT_TYPE=$(echo "$ACCOUNT" | jq -r '.type')

  echo "Счет: $ACCOUNT_NAME (тип: $ACCOUNT_TYPE)"

  if [ "$ACCOUNT_TYPE" == "card" ]; then
    echo "✅ УСПЕХ: Счет правильно определен как 'карта' (card)"
  else
    echo "❌ ОШИБКА: Ожидался тип 'card', получен '$ACCOUNT_TYPE'"
  fi
else
  echo "❌ ОШИБКА: Транзакция не создана"
  echo "Детали ошибки:"
  echo "$RESPONSE" | jq '.error // .message // .'
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Тест 3: "такси 50смн" (без указания счета)
echo "📝 Тест 3: 'такси 50смн' (без указания счета - дефолтный)"
RESPONSE=$(curl -s -X POST "${API_URL}/ai/parse" \
  -H "Content-Type: application/json" \
  -d '{"text": "такси 50смн"}')

echo "Ответ:"
echo "$RESPONSE" | jq '.'
echo ""

TRANSACTION_ID=$(echo "$RESPONSE" | jq -r '.transactions[0].id // empty')

if [ ! -z "$TRANSACTION_ID" ]; then
  echo "✅ Транзакция создана с ID: $TRANSACTION_ID"

  TRANSACTION=$(curl -s "${API_URL}/transactions/$TRANSACTION_ID")
  ACCOUNT_ID=$(echo "$TRANSACTION" | jq -r '.accountId')

  ACCOUNT=$(curl -s "${API_URL}/accounts" | jq ".[] | select(.id == \"$ACCOUNT_ID\")")
  ACCOUNT_NAME=$(echo "$ACCOUNT" | jq -r '.name')

  echo "Счет (дефолтный): $ACCOUNT_NAME"
  echo "✅ УСПЕХ: Использован дефолтный счет"
else
  echo "❌ ОШИБКА: Транзакция не создана"
  echo "Детали ошибки:"
  echo "$RESPONSE" | jq '.error // .message // .'
fi

echo ""
echo "=== Тесты завершены ==="

