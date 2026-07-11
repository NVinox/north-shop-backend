import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateCartItemDTO {
  @ApiProperty({
    description: 'Количество товара',
    type: 'integer',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  quantity!: number;

  @ApiProperty({
    description: 'Цена при добавлении в корзину одного товара',
    type: 'integer',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  @IsPositive()
  priceAtAddition!: number;

  @ApiProperty({
    description: 'ID Корзины',
    type: 'integer',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  @Transform(({ value }) => parseInt(value))
  cartId!: number;

  @ApiProperty({
    description: 'ID Продукта',
    type: 'integer',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  @Transform(({ value }) => parseInt(value))
  productId!: number;
}
