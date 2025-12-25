#!/bin/bash

# Финальный тест AI парсера с распознаванием счетов

API_URL="http://localhost:3001/api"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║    🧪 ТЕСТ AI ПАРСЕРА С РАСПОЗНАВАНИЕМ СЧЕТОВ             ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Функция для тестирования парсинга
test_parse() {
    local test_name="$1"
    local text="$2"
    local expected_account_type="$3"

    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📝 $test_name"
    echo "Текст: \"$text\""
    echo ""

    # Парсим текст
    RESPONSE=$(curl -s -X POST "${API_URL}/ai/parse" \
        -H "Content-Type: application/json" \
        -d "{\"text\": \"$text\"}")

    # Проверяем успех
    SUCCESS=$(echo "$RESPONSE" | jq -r '.success // false')

    if [ "$SUCCESS" != "true" ]; then
        echo "❌ Ошибка парсинга:"
        echo "$RESPONSE" | jq '.'
        return
    fi

    # Получаем ID транзакции и счета
    TRANSACTION_ID=$(echo "$RESPONSE" | jq -r '.transactions[0].id')
    ACCOUNT_ID=$(echo "$RESPONSE" | jq -r '.transactions[0].accountId')
    AMOUNT=$(echo "$RESPONSE" | jq -r '.transactions[0].amount')
    DESCRIPTION=$(echo "$RESPONSE" | jq -r '.transactions[0].description')

    echo "✅ Транзакция создана:"
    echo "   ID: $TRANSACTION_ID"
    echo "   Описание: $DESCRIPTION"
    echo "   Сумма: $AMOUNT TJS"

    # Получаем информацию о счете
    ACCOUNT=$(curl -s "${API_URL}/accounts" | jq ".[] | select(.id == \"$ACCOUNT_ID\")")
    ACCOUNT_NAME=$(echo "$ACCOUNT" | jq -r '.name')
    ACCOUNT_TYPE=$(echo "$ACCOUNT" | jq -r '.type')

    echo "   Счет: $ACCOUNT_NAME ($ACCOUNT_TYPE)"

    # Проверяем тип счета
    if [ "$ACCOUNT_TYPE" == "$expected_account_type" ]; then
        echo "   ✅ Счет определен правильно!"
    else
        echo "   ❌ Ошибка: ожидался тип '$expected_account_type', получен '$ACCOUNT_TYPE'"
    fi

    echo ""
}

# Тесты
test_parse "Тест 1: Наличные" "хлеб 25с наличными" "cash"
test_parse "Тест 2: Карта (картой)" "кофе 30смн картой" "card"
test_parse "Тест 3: Карта (карта)" "такси 50 на карту" "card"
test_parse "Тест 4: Наличные (наличка)" "пиво 15с наличкой" "cash"
test_parse "Тест 5: Наличные (кешем)" "шоколадка 10смн кешем" "cash"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                   🎯 ИТОГИ ТЕСТИРОВАНИЯ                    ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "Проверим все счета в системе:"
curl -s "${API_URL}/accounts" | jq -r '.[] | "  • \(.name) (\(.type)) - ID: \(.id)"'
echo ""
echo "Последние 5 транзакций:"
curl -s "${API_URL}/transactions" | jq -r '.[0:5] | .[] | "  • \(.description // "без описания") - \(.amount) TJS - AccountID: \(.accountId)"'
echo ""
echo "✅ Тестирование завершено!"

