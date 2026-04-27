import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateProductDTO {
  @IsString()
  @IsNotEmpty()
  @Length(3, 255)
  title!: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  price!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  sku!: string;

  @IsInt()
  @IsOptional()
  @Max(100)
  @Min(0)
  discount!: number;
}
