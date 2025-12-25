import { IsString, IsNumber, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty({ enum: ['income', 'expense', 'transfer', 'debt'] })
  @IsEnum(['income', 'expense', 'transfer', 'debt'])
  type: 'income' | 'expense' | 'transfer' | 'debt';

  @ApiProperty({ example: 100 })
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 'TJS', default: 'TJS' })
  @IsString()
  @IsOptional()
  currency?: string = 'TJS';

  @ApiProperty({ example: 'category-uuid', required: false })
  @IsString()
  @IsOptional()
  categoryId?: string;

  @ApiProperty({ example: 'account-uuid' })
  @IsString()
  accountId: string;

  @ApiProperty({ example: 'account-to-uuid', required: false })
  @IsString()
  @IsOptional()
  accountToId?: string;

  @ApiProperty({ example: 'Американо в кофейне', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'Кофейня на углу', required: false })
  @IsString()
  @IsOptional()
  place?: string;

  @ApiProperty({ example: 'Иван Петров', required: false })
  @IsString()
  @IsOptional()
  person?: string;

  @ApiProperty({ example: 'Дополнительный комментарий', required: false })
  @IsString()
  @IsOptional()
  comment?: string;

  @ApiProperty({ enum: ['i_gave', 'i_returned', 'they_gave', 'they_returned'], required: false })
  @IsEnum(['i_gave', 'i_returned', 'they_gave', 'they_returned'])
  @IsOptional()
  debtSubType?: 'i_gave' | 'i_returned' | 'they_gave' | 'they_returned';

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  date?: string;
}

