import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { CartService } from './cart.service';

import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

import { AddProductCartDTO } from './dto/add-product-cart.dto';
import { PaginationQueryDTO } from 'src/common/dto/pagination-query.dto';
import { ResponseCartItemDTO } from 'src/cart-item/dto/response-cart-item.dto';
import { PaginationResponseDTO } from 'src/common/dto/pagination-response.dto';
import { UpdateCartItemDTO } from 'src/cart-item/dto/update-cart-item.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(JwtAuthGuard)
  @Post('add')
  async createCartItem(
    @Body() dto: AddProductCartDTO,
    @CurrentUser('id') userId: number,
  ): Promise<ResponseCartItemDTO> {
    const cartItem = await this.cartService.createCartItem(dto, userId);

    return plainToInstance(ResponseCartItemDTO, cartItem, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllCartItemsByUserId(
    @Query() query: PaginationQueryDTO,
    @CurrentUser('id') userId: number,
  ): Promise<PaginationResponseDTO<ResponseCartItemDTO>> {
    const result = await this.cartService.getAllCartItemsByUserId(
      query,
      userId,
    );

    return {
      items: plainToInstance(ResponseCartItemDTO, result.items, {
        excludeExtraneousValues: true,
      }),
      meta: result.meta,
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateCartItem(
    @Param('id', ParseIntPipe) cartItemId: number,
    @Body() dto: UpdateCartItemDTO,
  ): Promise<ResponseCartItemDTO> {
    const cartItem = await this.cartService.updateCartItem(cartItemId, dto);

    return plainToInstance(ResponseCartItemDTO, cartItem, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteCartItem(
    @Param('id', ParseIntPipe) cartItemId: number,
  ): Promise<Boolean> {
    return await this.cartService.deleteCartItem(cartItemId);
  }
}
