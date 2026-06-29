import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Length, Max, Min } from 'class-validator';

export class CreateReviewDTO {
  @ApiProperty({
    description: 'Текст отзыва',
    type: 'string',
    example: 'Тестовый текст отзыва',
  })
  @IsString()
  @IsNotEmpty()
  @Length(5, 255)
  text!: string;

  @ApiProperty({
    description: 'Рейтинг',
    type: 'integer',
    example: 4,
  })
  @IsInt()
  @Max(5)
  @Min(0)
  @Type(() => Number)
  rating!: number;

  @ApiProperty({
    description: 'ID Пользователя',
    type: 'integer',
    example: 1,
  })
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  userId!: number;

  @ApiProperty({
    description: 'ID Продукта',
    type: 'integer',
    example: 1,
  })
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  productId!: number;
}
