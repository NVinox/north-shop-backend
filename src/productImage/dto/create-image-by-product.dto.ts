import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional } from 'class-validator';

export class CreateImageByProductDTO {
  @ApiProperty({
    description: 'Файл изображения',
    type: 'string',
    format: 'binary',
  })
  image?: any;

  @ApiPropertyOptional({
    description: 'Флаг главной картинки',
    type: 'boolean',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  isMain?: boolean;

  @ApiProperty({
    description: 'ID продукта',
    type: 'integer',
    example: 1,
  })
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  productId!: number;
}
