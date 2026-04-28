import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateProductDTO {
  @ApiProperty({
    description: 'Название продукта',
    type: 'string',
    example: 'Молоко',
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 255)
  title!: string;

  @ApiProperty({
    description: 'Актуальная цена',
    type: 'number',
    example: 100,
  })
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  price!: number;

  @ApiProperty({
    description: 'Артикул (уникальное значение)',
    type: 'string',
    example: '000001',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  sku!: string;

  @ApiPropertyOptional({
    description: 'Скидка на продукт',
    type: 'integer',
    example: 10,
  })
  @IsInt()
  @IsOptional()
  @Max(100)
  @Min(0)
  discount!: number;
}
