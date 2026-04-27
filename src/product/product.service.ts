import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { CreateProductDTO } from './dto/createProduct.dto';
import { UpdateProductDTO } from './dto/updateProduct.dto';
import { QueryProductDTO } from './dto/queryProduct.dto';
import { PaginationResponseDTO } from 'src/common/dto/paginationResponse.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async getAll(
    query: QueryProductDTO,
  ): Promise<PaginationResponseDTO<ProductEntity>> {
    const queryBuilder = this.productRepository.createQueryBuilder('products');
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
    const product = await this.productRepository.findOneBy({ id });

    if (!product) {
      throw new NotFoundException();
    }

    return product;
  }

  async create(dto: CreateProductDTO): Promise<ProductEntity> {
    await this.existSku(dto.sku);

    const product = this.productRepository.create(dto);

    this.calculatePrice(product);

    return await this.productRepository.save(product);
  }

  async update(id: number, dto: UpdateProductDTO): Promise<ProductEntity> {
    if (dto.sku) {
      await this.existSku(dto.sku);
    }

    const product = await this.getOne(id);

    Object.assign(product, dto);
    this.calculatePrice(product);

    return await this.productRepository.save(product);
  }

  async delete(id: number): Promise<boolean> {
    const product = await this.getOne(id);

    await this.productRepository.remove(product);

    return true;
  }

  private async existSku(sku: string): Promise<void> {
    const exists = await this.productRepository.findOneBy({ sku });

    if (exists) {
      throw new ConflictException('sku is already taken');
    }
  }

  private calculatePrice(product: ProductEntity): void {
    if (product.discount) {
      product.oldPrice = Math.round(
        (product.price * (product.discount + 100)) / 100,
      );
    } else {
      product.oldPrice = null;
    }
  }
}
