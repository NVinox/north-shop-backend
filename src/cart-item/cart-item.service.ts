import {
  Inject,
  forwardRef,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CartEntityItem } from './entities/cart-item.entity';
import { ProductService } from 'src/product/product.service';

import { CreateCartItemDTO } from './dto/create-cart-item.dto';
import { CartService } from 'src/cart/cart.service';

@Injectable()
export class CartItemService {
  constructor(
    @InjectRepository(CartEntityItem)
    private readonly cartItemRepository: Repository<CartEntityItem>,
    @Inject(forwardRef(() => CartService))
    private readonly cartService: CartService,
    private readonly productService: ProductService,
  ) {}

  async create(dto: CreateCartItemDTO): Promise<CartEntityItem> {
    const { productId, cartId } = dto;
    const product = await this.productService.existProduct(productId);

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const cart = await this.cartService.existCart(cartId);

    if (!cart) {
      throw new NotFoundException(`Cart with ID ${cartId} not found`);
    }

    const cartItem = this.cartItemRepository.create(dto);

    return await this.cartItemRepository.save(cartItem);
  }
}
