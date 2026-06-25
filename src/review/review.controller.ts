import { Controller, Get } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { ReviewService } from './review.service';

import { ResponseReviewDTO } from './dto/response-review.dto';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  async getAll() {
    const reviews = await this.reviewService.getAll();
    return plainToInstance(ResponseReviewDTO, reviews, {
      excludeExtraneousValues: true,
    });
  }
}
