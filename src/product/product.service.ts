import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';

import { ProductEntity } from './entities/product.entity';
import { CreateProductDTO } from './dto/create-product.dto';
import { UpdateProductDTO } from './dto/update-product.dto';
import { QueryProductDTO } from './dto/query-product.dto';
import { PaginationResponseDTO } from 'src/common/dto/pagination-response.dto';

import { ProductImageService } from 'src/productImage/product-image.service';
import { CreateImageByProductDTO } from 'src/productImage/dto/create-image-by-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @Inject(forwardRef(() => ProductImageService))
    private readonly productImageService: ProductImageService,
  ) {}

  async getAll(
    query: QueryProductDTO,
  ): Promise<PaginationResponseDTO<ProductEntity>> {
    const queryBuilder = this.productRepository.createQueryBuilder('products');

    queryBuilder.leftJoinAndSelect('products.images', 'images');

    const { page, limit, sortBy, sortOrder, minPrice, maxPrice, search } =
      query;

    if (minPrice !== undefined) {
      queryBuilder.andWhere('products.price >= :minPrice', { minPrice });
    }

    if (maxPrice !== undefined) {
      queryBuilder.andWhere('products.price <= :maxPrice', { maxPrice });
    }

    if (search) {
      queryBuilder.andWhere('products.title ILIKE :search', {
        search: `%${search}%`,
      });
    }

    queryBuilder
      .orderBy(`products.${sortBy}`, sortOrder)
      .skip((page - 1) * limit)
      .take(limit);

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

  async getOne(id: number): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['images'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async create(
    dto: CreateProductDTO,
    files: Express.Multer.File[],
  ): Promise<ProductEntity> {
    const { slug, sku } = await this.generateProductMetadata(dto.title);

    const product = this.productRepository.create({
      ...dto,
      sku,
      slug,
    });

    this.calculatePrice(product);

    const createdProduct = await this.productRepository.save(product);

    await this.createProductImage(createdProduct.id, files);

    return await this.getOne(createdProduct.id);
  }

  async update(id: number, dto: UpdateProductDTO): Promise<ProductEntity> {
    const product = await this.getOne(id);

    if (dto.title) {
      const { slug } = await this.generateProductMetadata(dto.title);

      Object.assign(product, { ...dto, slug });
    } else {
      Object.assign(product, dto);
    }

    this.calculatePrice(product);

    return await this.productRepository.save(product);
  }

  async updateReviewStats(productId: number): Promise<void> {
    const stats = await this.productRepository.manager
      .createQueryBuilder('reviews', 'r')
      .select('COUNT(r.id)', 'count')
      .addSelect('AVG(r.rating)', 'avg')
      .where('r.product_id = :productId', { productId })
      .getRawOne();

    await this.productRepository.update(productId, {
      reviewCount: parseInt(stats.count) || 0,
      ratingAvg: stats.avg ? parseFloat(parseFloat(stats.avg).toFixed(1)) : 0,
    });
  }

  async delete(id: number): Promise<boolean> {
    const product = await this.getOne(id);

    for (const image of product.images) {
      await this.productImageService.removeImage(image.url);
    }

    await this.productRepository.remove(product);

    return true;
  }

  async existProduct(id: number): Promise<boolean> {
    return await this.productRepository.existsBy({ id });
  }

  private async generateProductMetadata(
    title: string,
  ): Promise<{ sku: string; slug: string }> {
    let nextSkuNumber = 1;
    const lastProduct = await this.productRepository.findOne({
      where: {},
      order: { id: 'DESC' },
    });

    if (lastProduct && lastProduct.sku) {
      nextSkuNumber = parseInt(lastProduct.sku, 10) + 1;
    }

    const generatedSku = String(nextSkuNumber).padStart(6, '0');
    const translatedTitle = slugify(title, {
      lower: true,
      strict: true,
      locale: 'ru',
    });

    return {
      sku: generatedSku,
      slug: `${translatedTitle}-${generatedSku}`,
    };
  }

  private calculatePrice(product: ProductEntity): void {
    if (product.discount) {
      product.oldPrice = Math.round(
        (product.price * 100) / (100 - product.discount),
      );
    } else {
      product.oldPrice = null;
    }
  }

  private async createProductImage(
    productId: number,
    files: Express.Multer.File[],
  ) {
    if (files && files.length) {
      for (const [index, file] of files.entries()) {
        const imageDTO: CreateImageByProductDTO = {
          productId,
        };

        if (!index) {
          imageDTO.isMain = true;
        }

        await this.productImageService.createImageByProduct(imageDTO, file);
      }
    }
  }
}
