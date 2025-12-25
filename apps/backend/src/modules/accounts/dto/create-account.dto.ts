import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAccountDto {
  @ApiProperty({ example: 'Моя карта' })
  @IsString()
  name: string;

  @ApiProperty({ enum: ['cash', 'card', 'bank', 'savings'] })
  @IsEnum(['cash', 'card', 'bank', 'savings'])
  type: 'cash' | 'card' | 'bank' | 'savings';

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
}

