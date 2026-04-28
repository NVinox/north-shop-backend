import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetaDTO {
  @ApiProperty({
    description: 'Общее количество элементов',
    type: 'integer',
    example: 16,
  })
  totalItems!: number;

  @ApiProperty({
    description: 'Количество элементов на странице',
    type: 'integer',
    example: 10,
  })
  itemCount!: number;

  @ApiProperty({
    description: 'Принятое количество элементов для пагинации',
    type: 'integer',
    example: 10,
  })
  @ApiProperty()
  itemsPerPage!: number;

  @ApiProperty({
    description: 'Количество страниц',
    type: 'integer',
    example: 2,
  })
  totalPages!: number;

  @ApiProperty({
    description: 'Номер текущей страницы',
    type: 'integer',
    example: 1,
  })
  currentPage!: number;
}
