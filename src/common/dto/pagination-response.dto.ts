import { Expose } from 'class-transformer';
import { PaginationMetaDTO } from './pagination-meta.dto';

export class PaginationResponseDTO<T> {
  @Expose()
  items!: T[];

  @Expose()
  meta!: PaginationMetaDTO;
}
