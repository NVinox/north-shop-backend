import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ReviewEntity } from './entities/review.entity';

import { PaginationResponseDTO } from 'src/common/dto/pagination-response.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
  ) {}

  async getAll(): Promise<ReviewEntity[]> {
    const reviews = await this.reviewRepository.find();

    return reviews;
  }
}
