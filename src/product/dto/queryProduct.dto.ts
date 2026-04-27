import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDTO } from 'src/common/dto/paginationQuery.dto';
import { EProductSortBy } from '../enums/productSortBy.enum';

export class QueryProductDTO extends PaginationQueryDTO {
  @IsOptional()
  @IsEnum(EProductSortBy)
  sortBy: EProductSortBy = EProductSortBy.CREATED_AT;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  maxPrice?: number;

  @IsOptional()
  @IsString()
  search?: string;
}
