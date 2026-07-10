import { Body, Controller, Post } from '@nestjs/common';

import { CartService } from './cart.service';
import { CartEntityItem } from 'src/cart-item/entities/cart-item.entity';
import { CreateCartItemDTO } from 'src/cart-item/dto/create-cart-item.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  async createCartItem(
    @Body() dto: CreateCartItemDTO,
  ): Promise<CartEntityItem> {
    return await this.cartService.createCartItem(dto);
  }
}
