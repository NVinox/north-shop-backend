import { Expose, Transform } from 'class-transformer';

export class ResponseReviewDTO {
  @Expose()
  id!: number;

  @Expose()
  text!: string;

  @Expose()
  rating!: number;

  @Expose()
  createdAt!: Date;

  @Expose({ name: 'userName' })
  @Transform(({ obj }) => obj.user?.name || 'Аноним')
  userName!: string;
}
