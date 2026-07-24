import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ResponseProductDTO {
  @ApiProperty({
    description: 'ID Продукта',
    type: 'integer',
    example: 1,
  })
  @Expose()
  id!: number;

  @ApiProperty({
    description: 'Название продукта',
    type: 'string',
    example: 'Молоко',
  })
  @Expose()
  title!: string;

  @ApiProperty({
    description: 'Актуальная цена',
    type: 'number',
    example: 100,
  })
  @Expose()
  price!: number;

  @ApiProperty({
    description: 'Старая цена',
    type: 'number',
    nullable: true,
    example: 200,
  })
  @Expose()
  oldPrice!: number;

  @ApiProperty({
    description: 'Артикул',
    type: 'string',
    example: '000001',
  })
  @Expose()
  sku!: string;

  @ApiProperty({
    description: 'Slug товара',
    type: 'string',
    example: 'Moloko',
  })
  @Expose()
  slug!: string;

  @ApiProperty({
    description: 'Скидка',
    type: 'number',
    example: 50,
  })
  @Expose()
  discount!: number;

  @ApiProperty({
    description: 'Средний рейтинг',
    type: 'number',
    example: 4.5,
  })
  @Expose()
  ratingAvg!: number;

  @ApiProperty({
    description: 'Количество отзывов',
    type: 'integer',
    example: 22,
  })
  @Expose()
  reviewCount!: number;
}
