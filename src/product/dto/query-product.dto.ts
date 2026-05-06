import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDTO } from 'src/common/dto/pagination-query.dto';
import { EProductSortBy } from '../enums/product-sort-by.enum';

export class QueryProductDTO extends PaginationQueryDTO {
  @ApiPropertyOptional({
    description: 'Выбор поля для сортировки',
    enum: EProductSortBy,
    type: 'string',
    example: EProductSortBy.CREATED_AT,
    default: EProductSortBy.CREATED_AT,
  })
  @IsOptional()
  @IsEnum(EProductSortBy)
  sortBy: EProductSortBy = EProductSortBy.CREATED_AT;

  @ApiPropertyOptional({
    description: 'Минимальная цена',
    type: 'number',
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  minPrice?: number;

  @ApiPropertyOptional({
    description: 'Максимальная цена',
    type: 'number',
    example: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  maxPrice?: number;

  @ApiPropertyOptional({
    description: 'Поиск по названию',
    type: 'string',
    example: 'Молоко',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
