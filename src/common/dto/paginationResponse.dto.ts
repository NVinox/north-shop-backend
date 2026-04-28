import { Expose } from 'class-transformer';
import { PaginationMetaDTO } from './paginationMeta.dto';

export class PaginationResponseDTO<T> {
  @Expose()
  items!: T[];

  @Expose()
  meta!: PaginationMetaDTO;
}
