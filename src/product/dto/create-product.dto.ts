import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { CreatePatchProductDTO } from './create-patch-product.dto';

export class CreateProductDTO extends CreatePatchProductDTO {
  @ApiPropertyOptional({
    description: 'Массив изображений',
    type: 'array',
    items: { type: 'string', format: 'binary' },
  })
  @IsOptional()
  images!: any[];
}
