import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { ResponseProductDTO } from './response-product.dto';
import { ResponseProductImageDTO } from 'src/productImage/dto/response-product-image.dto';

export class ResponseProductOneDTO extends ResponseProductDTO {
  @ApiProperty({
    description: 'Список изображений продукта',
    type: [ResponseProductImageDTO],
  })
  @Expose()
  @Type(() => ResponseProductImageDTO)
  images!: ResponseProductImageDTO[];
}
