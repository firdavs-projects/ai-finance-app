import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { ParseExpenseDto } from './dto/parse-expense.dto';

@ApiTags('AI')
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('parse')
  @ApiOperation({
    summary: 'Распарсить текст о расходе/доходе',
    description: 'Принимает естественный текст типа "американо 22смн, чизкейк 15смн" и создаёт транзакции'
  })
  parseExpense(@Body() parseExpenseDto: ParseExpenseDto) {
    return this.aiService.parseAndCreateTransactions(parseExpenseDto.text, parseExpenseDto.accountId);
  }
}

