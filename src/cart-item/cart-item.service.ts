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

    const createdCartItem = this.cartItemRepository.create(dto);
    const cartItem = await this.cartItemRepository.save(createdCartItem);

    const cartItemWithProduct = await this.cartItemRepository.findOne({
      where: {
        id: cartItem.id,
      },
      relations: ['product'],
    });

    if (!cartItemWithProduct) {
      throw new NotFoundException('Cart item not found after saving');
    }

    return cartItemWithProduct;
  }

  async delete(id: number): Promise<Boolean> {
    const cartItem = await this.cartItemRepository.findOneBy({ id });

    if (!cartItem) {
      throw new NotFoundException(`Cart item with ID ${id} not found`);
    }

    await this.cartItemRepository.remove(cartItem);

    return true;
  }
}
