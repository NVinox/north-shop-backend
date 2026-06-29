import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class ResponseReviewDTO {
  @ApiProperty({
    description: 'ID Отзыва',
    type: 'integer',
    example: 1,
  })
  @Expose()
  id!: number;

  @ApiProperty({
    description: 'Текст отзыва',
    type: 'string',
    example: 'Тестовый текст отзыва',
  })
  @Expose()
  text!: string;

  @ApiProperty({
    description: 'Рейтинг',
    type: 'integer',
    example: 5,
  })
  @Expose()
  rating!: number;

  @ApiProperty({
    description: 'Имя пользователя',
    type: 'string',
    example: 'Иван',
  })
  @Expose({ name: 'userName' })
  @Transform(({ obj }) => obj.user?.name || 'Аноним')
  userName!: string;

  @ApiProperty({
    description: 'Дата создания отзыва',
    type: Date,
    example: '2026-06-29T15:42:08.851Z',
  })
  @Expose()
  createdAt!: Date;
}
