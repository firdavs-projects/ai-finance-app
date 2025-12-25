#!/bin/bash

# Скрипт для тестирования разных MongoDB connection strings
# Использование: ./test-mongodb-connection.sh

echo "🔍 Тестирование MongoDB подключения..."
echo ""

# Варианты hostnames для MongoDB Atlas
HOSTNAMES=(
  "cluster0.mongodb.net"
  "cluster0.vdgxk.mongodb.net"
  "ac-xxxxx-shard-00-00.vdgxk.mongodb.net"
)

USERNAME="firdavsabdulloev7725_db_user"
PASSWORD="ml5opQDrSytbMA6p"
DATABASE="ai-finance-bd"

for HOST in "${HOSTNAMES[@]}"; do
  echo "Тестирование hostname: $HOST"
  MONGODB_URI="mongodb+srv://$USERNAME:$PASSWORD@$HOST/$DATABASE?retryWrites=true&w=majority"

  # Попытка подключения с timeout
  timeout 5 node -e "
    const mongoose = require('mongoose');
    mongoose.connect('$MONGODB_URI')
      .then(() => {
        console.log('✅ Подключение успешно!');
        process.exit(0);
      })
      .catch(err => {
        console.log('❌ Ошибка:', err.message);
        process.exit(1);
      });
  " 2>&1

  echo ""
done

echo "📝 Рекомендация: Получите правильный connection string из MongoDB Atlas"
echo "   1. Откройте https://cloud.mongodb.com/"
echo "   2. Выберите проект 'ai-finance-bd'"
echo "   3. Database → Connect → Drivers → Connection String"

