import { IsString, IsNumber, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAccountDto {
  @ApiProperty({ example: 'Моя карта' })
  @IsString()
  name: string;

  @ApiProperty({ enum: ['cash', 'card', 'bank', 'savings', 'debt'] })
  @IsEnum(['cash', 'card', 'bank', 'savings', 'debt'])
  type: 'cash' | 'card' | 'bank' | 'savings' | 'debt';

  @ApiProperty({ example: 0, required: false })
  @IsNumber()
  @IsOptional()
  balance?: number;

  @ApiProperty({ example: 'TJS', default: 'TJS' })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiProperty({ required: false, description: 'Флаг долгового счета' })
  @IsBoolean()
  @IsOptional()
  isDebt?: boolean;

  @ApiProperty({ required: false, description: 'Флаг скрытого счета' })
  @IsBoolean()
  @IsOptional()
  isHidden?: boolean;

  @ApiProperty({ required: false, description: 'Имя человека для долгового счета' })
  @IsString()
  @IsOptional()
  debtPerson?: string;
}

