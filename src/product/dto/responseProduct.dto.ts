import { Expose } from 'class-transformer';

export class ResponseProductDTO {
  @Expose()
  id!: number;

  @Expose()
  title!: string;

  @Expose()
  price!: number;

  @Expose()
  oldPrice!: number;

  @Expose()
  sku!: string;

  @Expose()
  discount!: number;

  @Expose()
  ratingAvg!: number;

  @Expose()
  reviewCount!: number;
}
