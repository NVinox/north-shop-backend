import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

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
    example: 'https://www.example.com/assets/image.jpg',
  })
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
