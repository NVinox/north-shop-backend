import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateRefreshTokenDTO {
  @ApiProperty({
    description: 'Хэш refresh токена',
    type: 'string',
    example: '23SD$%32Csd3@4',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  token!: string;

  @ApiProperty({
    description: 'ID пользователя',
    type: 'integer',
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  @IsInt()
  userId!: number;

  @ApiPropertyOptional({
    description: 'User Agent пользователя',
    type: 'string',
    example: 'Mozilla/5.0...',
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  userAgent?: string;
}
