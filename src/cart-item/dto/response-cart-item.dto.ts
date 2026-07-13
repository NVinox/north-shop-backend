import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ResponseProductListDTO } from 'src/product/dto/response-product-list.dto';

export class ResponseCartItemDTO {
  @ApiProperty({
    description: 'ID позиции',
    type: 'integer',
    example: 1,
  })
  @Expose()
  id!: number;

  @ApiProperty({
    description: 'Цена на момент добавления',
    type: 'number',
    example: 100.5,
  })
  @Expose()
  priceAtAddition!: number;

  @ApiProperty({
    description: 'Количество товара',
    type: 'integer',
    example: 5,
  })
  @Expose()
  quantity!: number;

  @ApiProperty({
    description: 'Продукт',
    type: [ResponseProductListDTO],
  })
  @Expose()
  @Type(() => ResponseProductListDTO)
  product!: ResponseProductListDTO;
}
