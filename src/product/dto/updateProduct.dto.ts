import { CreateProductDTO } from './createProduct.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateProductDTO extends PartialType(CreateProductDTO) {}
