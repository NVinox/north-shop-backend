import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { config } from 'dotenv';

config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export class ResponseProductImageDTO {
  @ApiProperty({
    description: 'ID картинки',
    type: 'integer',
    example: 1,
  })
  @Expose()
  id!: number;

  @ApiProperty({
    description: 'ID картинки',
    type: 'string',
    example: 'https://www.example.com/static/image.jpg',
  })
  @Transform(
    ({ obj }) => `${process.env.API_URL}/${process.env.STATIC_PATH}/${obj.url}`,
  )
  @Expose()
  url!: string;

  @ApiProperty({
    description: 'Флаг главной картинки',
    type: 'boolean',
    example: false,
  })
  @Expose()
  isMain!: boolean;

  @ApiProperty({
    description: 'ID связанного продукта',
    type: 'integer',
    example: 2,
  })
  @Expose()
  productId!: number;
}
