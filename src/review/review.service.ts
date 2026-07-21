import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ReviewEntity } from './entities/review.entity';

import { PaginationResponseDTO } from 'src/common/dto/pagination-response.dto';
import { PaginationQueryDTO } from 'src/common/dto/pagination-query.dto';
import { CreateReviewDTO } from './dto/create-review.dto';

import { ProductService } from 'src/product/product.service';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
    private readonly productService: ProductService,
    private readonly userService: AuthService,
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

  async create(dto: CreateReviewDTO, userId: number): Promise<ReviewEntity> {
    const product = await this.productService.existProduct(dto.productId);

    if (!product) {
      throw new NotFoundException(`Product with ID ${dto.productId} not found`);
    }

    const user = await this.userService.getUser(userId);

    if (!user) {
      throw new NotFoundException(`User with ID ${dto.productId} not found`);
    }

    const alreadyReviewed = await this.reviewRepository.existsBy({
      product: { id: dto.productId },
      user: { id: userId },
    });

    if (alreadyReviewed) {
      throw new ConflictException(
        'You have already left a review for this product',
      );
    }

    const review = this.reviewRepository.create({ user, ...dto });
    const createdReview = await this.reviewRepository.save(review);

    await this.productService.updateReviewStats(dto.productId);

    return createdReview;
  }

  async delete(id: number): Promise<boolean> {
    const review = await this.reviewRepository.findOne({ where: { id } });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    await this.reviewRepository.remove(review);
    await this.productService.updateReviewStats(review.productId);

    return true;
  }
}
