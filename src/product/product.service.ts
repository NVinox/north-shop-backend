import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { ProductEntity } from './entities/product.entity';
import { CreateProductDTO } from './dto/create-product.dto';
import { UpdateProductDTO } from './dto/update-product.dto';
import { QueryProductDTO } from './dto/query-product.dto';
import { PaginationResponseDTO } from 'src/common/dto/pagination-response.dto';

import { ProductImageService } from 'src/productImage/product-image.service';
import { CreateProductImageDTO } from 'src/productImage/dto/create-product-image.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
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
      throw new NotFoundException();
    }

    return product;
  }

  async create(
    dto: CreateProductDTO,
    files: Express.Multer.File[],
  ): Promise<ProductEntity> {
    await this.existSku(dto.sku);

    const product = this.productRepository.create(dto);

    this.calculatePrice(product);

    const createdProduct = await this.productRepository.save(product);

    await this.createProductImage(createdProduct.id, files);

    return await this.getOne(createdProduct.id);
  }

  async update(id: number, dto: UpdateProductDTO): Promise<ProductEntity> {
    if (dto.sku) {
      await this.existSku(dto.sku, id);
    }

    const product = await this.getOne(id);

    Object.assign(product, dto);
    this.calculatePrice(product);

    return await this.productRepository.save(product);
  }

  async delete(id: number): Promise<boolean> {
    const product = await this.getOne(id);

    for (const image of product.images) {
      await this.productImageService.removeImage(image.url);
    }

    await this.productRepository.remove(product);

    return true;
  }

  private async existSku(sku: string, productId?: number): Promise<void> {
    const product = await this.productRepository.findOneBy({ sku });

    if (productId) {
      if (product && product.id !== productId) {
        throw new ConflictException('sku is already taken');
      }
    } else {
      if (product) {
        throw new ConflictException('sku is already taken');
      }
    }
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
        const imageDTO: CreateProductImageDTO = {
          productId,
        };

        if (!index) {
          imageDTO.isMain = true;
        }

        await this.productImageService.create(imageDTO, file);
      }
    }
  }
}
