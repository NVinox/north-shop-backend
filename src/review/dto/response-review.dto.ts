import { Expose } from 'class-transformer';

export class ResponseReviewDTO {
  @Expose()
  id!: number;

  @Expose()
  text!: string;

  @Expose()
  rating!: number;

  @Expose()
  userId!: number;

  @Expose()
  createdAt!: Date;
}
