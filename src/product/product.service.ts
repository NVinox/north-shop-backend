import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDTO } from './dto/createProduct.dto';
import { UpdateProductDTO } from './dto/updateProduct.dto';
import { ProductEntity } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async getAll(): Promise<ProductEntity[]> {
    return await this.productRepository.find({ order: { createdAt: 'desc' } });
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
