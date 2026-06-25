import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { ReviewService } from './review.service';

import { ResponseReviewDTO } from './dto/response-review.dto';
import { PaginationResponseDTO } from 'src/common/dto/pagination-response.dto';
import { PaginationQueryDTO } from 'src/common/dto/pagination-query.dto';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get(':productId')
  async getAllByProduct(
    @Param('productId', ParseIntPipe) productId: number,
    @Query() query: PaginationQueryDTO,
  ): Promise<PaginationResponseDTO<ResponseReviewDTO>> {
    const result = await this.reviewService.getAllByProduct(productId, query);

    return {
      items: plainToInstance(ResponseReviewDTO, result.items, {
        excludeExtraneousValues: true,
      }),
      meta: result.meta,
    };
  }
}
