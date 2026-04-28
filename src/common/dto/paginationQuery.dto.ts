import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';

import { ESortProperty } from '../enums/sortProperty.enum';

export class PaginationQueryDTO {
  @ApiPropertyOptional({
    description: 'Номер страницы',
    type: 'integer',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({
    description: 'Количество элементов на странице',
    type: 'integer',
    example: 10,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;

  @ApiPropertyOptional({
    description: 'Направление сортировки',
    type: 'string',
    enum: ESortProperty,
    example: ESortProperty.DESC,
    default: ESortProperty.DESC,
  })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toUpperCase() : value,
  )
  @IsEnum(ESortProperty, {
    message: 'sortOrder must be one of the following values: asc, desc',
  })
  sortOrder?: ESortProperty = ESortProperty.DESC;
}
