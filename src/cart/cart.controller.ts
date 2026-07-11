import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { CartService } from './cart.service';
import { AddProductCartDTO } from './dto/add-product-cart.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtRefreshGuard } from 'src/auth/guards/jwt-refresh.guard';
import { ResponseCartItemDTO } from 'src/cart-item/dto/response-cart-item.dto';
import { plainToInstance } from 'class-transformer';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  @UseGuards(JwtRefreshGuard)
  async createCartItem(
    @Body() dto: AddProductCartDTO,
    @CurrentUser('id') userId: number,
  ): Promise<ResponseCartItemDTO> {
    const cartItem = await this.cartService.createCartItem(dto, userId);

    return plainToInstance(ResponseCartItemDTO, cartItem, {
      excludeExtraneousValues: true,
    });
  }
}
