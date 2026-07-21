import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class UpdateCartItemDTO {
  @ApiProperty({
    description: 'Количество товара',
    type: 'integer',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  quantity!: number;
}
