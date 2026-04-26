import { IsNumber, IsOptional, IsPositive } from 'class-validator';
import { CreateProductDTO } from './createProduct.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateProductDTO extends PartialType(CreateProductDTO) {
  @IsNumber()
  @IsOptional()
  @IsPositive()
  oldPrice!: number;
}
