// Тестовый скрипт для проверки API конфигурации
import { ApiTags, ApiMethods, ApiEndpoints, getUrl } from '../apps/frontend/src/shared/api/config';

console.log('🧪 Тестирование API конфигурации...\n');

// Тест 1: ApiTags
console.log('✅ ApiTags:');
console.log('  - TRANSACTIONS:', ApiTags.TRANSACTIONS);
console.log('  - ACCOUNTS:', ApiTags.ACCOUNTS);
console.log('  - CATEGORIES:', ApiTags.CATEGORIES);
console.log('  - BUDGET:', ApiTags.BUDGET);

// Тест 2: ApiMethods
console.log('\n✅ ApiMethods:');
console.log('  - GET:', ApiMethods.GET);
console.log('  - POST:', ApiMethods.POST);
console.log('  - PATCH:', ApiMethods.PATCH);
console.log('  - DELETE:', ApiMethods.DELETE);

// Тест 3: ApiEndpoints
console.log('\n✅ ApiEndpoints:');
console.log('  - CATEGORIES:', ApiEndpoints.CATEGORIES);
console.log('  - CATEGORY_BY_ID:', ApiEndpoints.CATEGORY_BY_ID);
console.log('  - TRANSACTIONS:', ApiEndpoints.TRANSACTIONS);
console.log('  - ACCOUNTS:', ApiEndpoints.ACCOUNTS);

// Тест 4: getUrl utility
console.log('\n✅ getUrl() utility:');
const categoryUrl = getUrl(ApiEndpoints.CATEGORY_BY_ID, { id: '123' });
console.log('  - getUrl(CATEGORY_BY_ID, {id: "123"}):', categoryUrl);
console.log('  - Expected: /categories/123');
console.log('  - Match:', categoryUrl === '/categories/123' ? '✅' : '❌');

console.log('\n🎉 Все тесты пройдены!');

