import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ParseExpenseDto {
  @ApiProperty({
    example: 'американо 22смн и чизкейк 15смн',
    description: 'Текст с описанием расходов/доходов на естественном языке'
  })
  @IsString()
  text: string;

  @ApiProperty({
    required: false,
    description: 'ID счёта для списания (опционально)'
  })
  @IsString()
  @IsOptional()
  accountId?: string;
}

