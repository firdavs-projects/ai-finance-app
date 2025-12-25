import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { TransactionsService } from '../transactions/transactions.service';
import { CategoriesService } from '../categories/categories.service';
import { AccountsService } from '../accounts/accounts.service';

interface ParsedTransaction {
  description: string;
  amount: number;
  currency: string;
  category: string;
  type: 'income' | 'expense';
}

interface AiParseResult {
  transactions: ParsedTransaction[];
  needsClarification: boolean;
  clarificationQuestion?: string;
}

@Injectable()
export class AiService {
  private openai: OpenAI;

  constructor(
    private configService: ConfigService,
    private transactionsService: TransactionsService,
    private categoriesService: CategoriesService,
    private accountsService: AccountsService,
  ) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');

    if (!apiKey) {
      console.error('❌ OPENAI_API_KEY is not configured in .env file!');
      throw new Error('OpenAI API key is missing');
    }

    console.log('✅ OpenAI client initialized with API key:', apiKey.substring(0, 10) + '...');

    this.openai = new OpenAI({
      apiKey: apiKey,
    });
  }

  async parseAndCreateTransactions(text: string, accountId?: string) {
    // Проверяем флаг MOCK режима
    const isMockMode = this.configService.get<string>('OPENAI_MOCK_MODE') === 'true';
    if (isMockMode) {
      console.log('🧪 MOCK MODE ENABLED - using mockParseAndCreate');
      return this.mockParseAndCreate(text, accountId);
    }

    const categories = await this.categoriesService.findAll();
    const accounts = await this.accountsService.findAll();

    const defaultAccountId = accountId || (accounts[0] as any)?._id?.toString() || '';

    const expenseCategories = categories.filter(c => c.type === 'expense');
    const incomeCategories = categories.filter(c => c.type === 'income');

    const systemPrompt = `Ты - финансовый ассистент. Извлеки транзакции из текста пользователя.

ДОСТУПНЫЕ КАТЕГОРИИ РАСХОДОВ:
${expenseCategories.map(c => `- ${c.name} (id: "${(c as any)._id}")`).join('\n') || '- Прочее (id: "general")'}

ДОСТУПНЫЕ КАТЕГОРИИ ДОХОДОВ:
${incomeCategories.map(c => `- ${c.name} (id: "${(c as any)._id}")`).join('\n') || '- Прочее (id: "general")'}

ПРАВИЛА:
1. Извлеки ВСЕ упомянутые покупки/доходы
2. Определи сумму и валюту (смн/сомони/с = TJS, рубль = RUB, $ = USD)
3. Подбери подходящую категорию по смыслу
4. Если категория не подходит - используй первую доступную

ФОРМАТ ОТВЕТА (строго JSON):
{
  "transactions": [
    {
      "description": "краткое описание",
      "amount": число,
      "currency": "TJS",
      "categoryId": "id из списка выше",
      "type": "expense"
    }
  ],
  "needsClarification": false,
  "clarificationQuestion": null
}

ПРИМЕРЫ:
Вход: "американо 22смн и чизкейк 15смн"
Выход: 2 транзакции с type="expense", amounts=[22, 15], currency="TJS"

Вход: "зарплата 5000 сомони"
Выход: 1 транзакция type="income", amount=5000, currency="TJS"

ВАЖНО: Всегда возвращай валидный JSON без дополнительного текста!`;

    try {
      console.log('🤖 AI Parse Request:', { text, accountId: defaultAccountId });
      console.log('📋 Available categories:', categories.length);
      console.log('📝 System prompt length:', systemPrompt.length, 'chars');

      console.log('🌐 Calling OpenAI API...');
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
      });
      console.log('✅ OpenAI API call successful');

      const content = response.choices[0]?.message?.content;
      console.log('✅ AI Response:', content);

      if (!content) {
        throw new Error('Empty response from AI');
      }

      const parsed: AiParseResult = JSON.parse(content);
      console.log('📊 Parsed result:', JSON.stringify(parsed, null, 2));

      if (parsed.needsClarification) {
        return {
          success: false,
          needsClarification: true,
          question: parsed.clarificationQuestion,
        };
      }

      // Создаём транзакции
      const createdTransactions = [];
      for (const t of parsed.transactions) {
        console.log('💾 Creating transaction:', t);

        // Fallback для categoryId: используем первую доступную категорию нужного типа
        let categoryId = (t as any).categoryId || t.category;
        if (!categoryId) {
          const fallbackCategory = categories.find(c => c.type === t.type);
          categoryId = (fallbackCategory as any)?._id?.toString();
          console.log('⚠️ Using fallback category:', categoryId);
        }

        const transaction = await this.transactionsService.create({
          type: t.type,
          amount: t.amount,
          currency: t.currency || 'TJS',
          categoryId: categoryId,
          accountId: defaultAccountId,
          description: t.description,
        });
        createdTransactions.push(transaction);
        console.log('✅ Transaction created:', transaction);
      }

      return {
        success: true,
        transactions: createdTransactions,
        message: `Создано ${createdTransactions.length} транзакций`,
      };
    } catch (error) {
      console.error('❌ AI parsing error:', error);
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);

      // Проверяем специфичные ошибки OpenAI
      if (error.status) {
        console.error('OpenAI API Status:', error.status);
      }
      if (error.type) {
        console.error('OpenAI Error Type:', error.type);
      }

      // Более информативная ошибка
      let errorMessage = 'Не удалось распознать текст. Попробуйте переформулировать.';

      if (error.message?.includes('API key') || error.status === 401) {
        errorMessage = 'Ошибка конфигурации API ключа OpenAI. Проверьте OPENAI_API_KEY в .env';
      } else if (error.message?.includes('rate limit') || error.status === 429) {
        errorMessage = 'Превышен лимит запросов к AI. Попробуйте позже.';
      } else if (error.message?.includes('JSON')) {
        errorMessage = 'Ошибка парсинга ответа AI';
      } else if (error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
        errorMessage = 'Нет подключения к серверам OpenAI. Проверьте интернет.';
      } else if (error.status === 500) {
        errorMessage = 'Ошибка на стороне OpenAI. Попробуйте позже.';
      }

      return {
        success: false,
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      };
    }
  }

  /**
   * Mock режим для тестирования без использования OpenAI API
   * Активируется через OPENAI_MOCK_MODE=true в .env
   */
  private async mockParseAndCreate(text: string, accountId?: string) {
    console.log('🧪 MOCK MODE: Simulating AI response for:', text);

    const categories = await this.categoriesService.findAll();
    const accounts = await this.accountsService.findAll();
    const defaultAccountId = accountId || (accounts[0] as any)?._id?.toString() || '';

    // Простой парсинг чисел из текста
    const numbers = text.match(/\d+/g) || [];
    const expenseCategory = categories.find(c => c.type === 'expense');
    const categoryId = (expenseCategory as any)?._id?.toString();

    // Создаём транзакции для каждого найденного числа
    const createdTransactions = [];
    for (const num of numbers) {
      const amount = parseFloat(num);
      if (amount > 0 && amount < 1000000) { // Разумные лимиты
        const transaction = await this.transactionsService.create({
          type: 'expense',
          amount: amount,
          currency: 'TJS',
          categoryId: categoryId,
          accountId: defaultAccountId,
          description: `MOCK: ${text.substring(0, 30)}`,
        });
        createdTransactions.push(transaction);
      }
    }

    // Если ничего не нашли - создаём одну транзакцию с дефолтной суммой
    if (createdTransactions.length === 0) {
      const transaction = await this.transactionsService.create({
        type: 'expense',
        amount: 10,
        currency: 'TJS',
        categoryId: categoryId,
        accountId: defaultAccountId,
        description: `MOCK: ${text}`,
      });
      createdTransactions.push(transaction);
    }

    console.log('✅ MOCK: Created', createdTransactions.length, 'transactions');

    return {
      success: true,
      transactions: createdTransactions,
      message: `🧪 MOCK: Создано ${createdTransactions.length} транзакций (тестовый режим)`,
    };
  }
}

