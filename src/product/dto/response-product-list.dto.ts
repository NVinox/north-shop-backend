import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

import { ResponseProductDTO } from './response-product.dto';

export class ResponseProductListDTO extends ResponseProductDTO {
  @ApiProperty({
    description: 'Изображение продукта',
    type: 'string',
    nullable: true,
    example: 'https://www.example.com/assets/image.jpg',
  })
  @Expose()
  @Transform(({ obj }) => {
    if (!obj.images || obj.images.length === 0) {
      return null;
    }

    const mainImage = obj.images.find((img) => img.isMain);
    const image = mainImage ? mainImage.url : obj.images[0].url || null;

    return image
      ? `${process.env.API_URL}/${process.env.STATIC_PATH}/${image}`
      : null;
  })
  image!: string;
}
