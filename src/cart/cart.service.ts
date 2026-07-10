import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { CartEntity } from './entities/cart.entity';
import { CartEntityItem } from 'src/cart-item/entities/cart-item.entity';

import { CreateCartItemDTO } from 'src/cart-item/dto/create-cart-item.dto';

import { CartItemService } from 'src/cart-item/cart-item.service';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,
    @Inject(forwardRef(() => CartItemService))
    private readonly cartItemService: CartItemService,
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

  async createCartItem(dto: CreateCartItemDTO): Promise<CartEntityItem> {
    return await this.cartItemService.create(dto);
  }

  async existCart(id: number): Promise<boolean> {
    return await this.cartRepository.existsBy({ id });
  }
}
