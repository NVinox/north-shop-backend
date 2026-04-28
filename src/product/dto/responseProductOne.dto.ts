import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { ResponseProductDTO } from './responseProduct.dto';
import { ResponseProductImageDTO } from 'src/productImage/dto/responseProductImage.dto';

export class ResponseProductOneDTO extends ResponseProductDTO {
  @ApiProperty({
    description: 'Список изображений продукта',
    type: [ResponseProductImageDTO],
  })
  @Expose()
  @Type(() => ResponseProductImageDTO)
  images!: ResponseProductImageDTO[];
}
