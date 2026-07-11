import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class AddProductCartDTO {
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
    description: 'ID Продукта',
    type: 'integer',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  @Transform(({ value }) => parseInt(value))
  productId!: number;
}
