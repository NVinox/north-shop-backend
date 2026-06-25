import { Transform, Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Length, Max, Min } from 'class-validator';

export class CreateReviewDTO {
  @IsString()
  @IsNotEmpty()
  @Length(5, 255)
  text!: string;

  @IsInt()
  @Max(5)
  @Min(0)
  @Type(() => Number)
  rating!: number;

  @IsInt()
  @Transform(({ value }) => parseInt(value))
  userId!: number;

  @IsInt()
  @Transform(({ value }) => parseInt(value))
  productId!: number;
}
