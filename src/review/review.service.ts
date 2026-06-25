import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ReviewEntity } from './entities/review.entity';

import { PaginationResponseDTO } from 'src/common/dto/pagination-response.dto';
import { PaginationQueryDTO } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
  ) {}

  async getAllByProduct(
    productId: number,
    query: PaginationQueryDTO,
  ): Promise<PaginationResponseDTO<ReviewEntity>> {
    const queryBuilder = this.reviewRepository.createQueryBuilder('reviews');

    queryBuilder.leftJoinAndSelect('reviews.product', 'product');
    queryBuilder.leftJoinAndSelect('reviews.user', 'user');
    queryBuilder.where('reviews.product_id = :productId', { productId });

    const { page, limit, sortOrder } = query;

    queryBuilder
      .orderBy('reviews.createdAt', sortOrder)
      .offset((page - 1) * limit)
      .limit(limit);

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      items,
      meta: {
        totalItems: total,
        itemCount: items.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  }
}
