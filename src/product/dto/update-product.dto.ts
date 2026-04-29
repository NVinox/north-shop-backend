import { PartialType } from '@nestjs/swagger';
import { CreatePatchProductDTO } from './create-patch-product.dto';

export class UpdateProductDTO extends PartialType(CreatePatchProductDTO) {}
