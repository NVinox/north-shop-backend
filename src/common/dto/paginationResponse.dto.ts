import { Expose } from 'class-transformer';

export class PaginationResponseDTO<T> {
  @Expose()
  items!: T[];

  @Expose()
  meta!: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}
