import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { CartEntity } from './entities/cart.entity';
import { CartEntityItem } from 'src/cart-item/entities/cart-item.entity';

import { AddProductCartDTO } from './dto/add-product-cart.dto';

import { CartItemService } from 'src/cart-item/cart-item.service';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,
    @Inject(forwardRef(() => CartItemService))
    private readonly cartItemService: CartItemService,
    private readonly productService: ProductService,
  ) {}

  async createCart(
    userId: number,
    manager?: EntityManager,
  ): Promise<CartEntity> {
    const repo = manager
      ? manager.getRepository(CartEntity)
      : this.cartRepository;
    const cart = repo.create({ userId });

    return await repo.save(cart);
  }

  async createCartItem(
    dto: AddProductCartDTO,
    userId: number,
  ): Promise<CartEntityItem> {
    const cart = await this.cartRepository.findOne({ where: { userId } });

    if (!cart) {
      throw new NotFoundException(`Cart with user ID ${userId} not found`);
    }

    const product = await this.productService.getOne(dto.productId);

    const itemCartDTO = {
      ...dto,
      cartId: cart.id,
      priceAtAddition: product.price,
    };

    return await this.cartItemService.create(itemCartDTO);
  }

  async existCart(id: number): Promise<boolean> {
    return await this.cartRepository.existsBy({ id });
  }
}
