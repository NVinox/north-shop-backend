import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt } from 'class-validator';

export class CreateCartItemDTO {
  @ApiProperty({
    description: 'Количество товара',
    type: 'integer',
    example: 1,
  })
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  quantity!: number;

  @ApiProperty({
    description: 'Цена при добавлении в корзину одного товара',
    type: 'integer',
    example: 1,
  })
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  priceAtAddition!: number;

  @ApiProperty({
    description: 'ID Корзины',
    type: 'integer',
    example: 1,
  })
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  cartId!: number;

  @ApiProperty({
    description: 'ID Продукта',
    type: 'integer',
    example: 1,
  })
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  productId!: number;
}
