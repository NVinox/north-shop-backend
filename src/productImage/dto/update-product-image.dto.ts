import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateProductImageDTO {
  @ApiPropertyOptional({
    description: 'Флаг главной картинки',
    type: 'boolean',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  isMain?: boolean;
}
