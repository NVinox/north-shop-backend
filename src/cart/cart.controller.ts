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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { CartService } from './cart.service';

import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

import { AddProductCartDTO } from './dto/add-product-cart.dto';
import { PaginationQueryDTO } from 'src/common/dto/pagination-query.dto';
import { ResponseCartItemDTO } from 'src/cart-item/dto/response-cart-item.dto';
import { PaginationResponseDTO } from 'src/common/dto/pagination-response.dto';
import { UpdateCartItemDTO } from 'src/cart-item/dto/update-cart-item.dto';
import { ErrorResponseDTO } from 'src/common/dto/error-response.dto';
import { PaginationMetaDTO } from 'src/common/dto/pagination-meta.dto';

import { ApiPaginatedResponse } from 'src/common/decorators/api-paginated-response.decorator';

@ApiTags('Корзина')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiOperation({
    summary: 'Создание позиции',
    description: 'Метод создания позиции товара в корзину',
  })
  @ApiCreatedResponse({
    description: 'Позиция создана',
    type: ResponseCartItemDTO,
  })
  @ApiBadRequestResponse({
    description: 'Ошибка неправильного запроса',
    type: ErrorResponseDTO,
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post()
  async createCartItem(
    @Body() dto: AddProductCartDTO,
    @CurrentUser('id') userId: number,
  ): Promise<ResponseCartItemDTO> {
    const cartItem = await this.cartService.createCartItem(dto, userId);

    return plainToInstance(ResponseCartItemDTO, cartItem, {
      excludeExtraneousValues: true,
    });
  }

  @ApiOperation({
    summary: 'Получения товаров',
    description: 'Метод получения товаров из корзины',
  })
  @ApiExtraModels(PaginationResponseDTO, ResponseCartItemDTO, PaginationMetaDTO)
  @ApiPaginatedResponse(ResponseCartItemDTO)
  @ApiBearerAuth('access-token')
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

  @ApiOperation({
    summary: 'Обновление позиции товара',
    description: 'Метод обновления позиции товара в корзине',
  })
  @ApiOkResponse({
    description: 'Позиция обновлена',
    type: ResponseCartItemDTO,
  })
  @ApiBadRequestResponse({
    description: 'Ошибка неправильного запроса',
    type: ErrorResponseDTO,
  })
  @ApiNotFoundResponse({
    description: 'Позиция не найдена',
    type: ErrorResponseDTO,
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateCartItem(
    @Param('id', ParseIntPipe) cartItemId: number,
    @Body() dto: UpdateCartItemDTO,
  ): Promise<ResponseCartItemDTO> {
    const cartItem = await this.cartService.updateCartItem(cartItemId, dto);

    return plainToInstance(ResponseCartItemDTO, cartItem, {
      excludeExtraneousValues: true,
    });
  }

  @ApiOperation({
    summary: 'Удаление позиции товара',
    description: 'Метод удаления позиции товара из корзины',
  })
  @ApiOkResponse({ description: 'Позиция удалена', type: Boolean })
  @ApiBadRequestResponse({
    description: 'Ошибка неправильного запроса',
    type: ErrorResponseDTO,
  })
  @ApiNotFoundResponse({
    description: 'Позиция не найдена',
    type: ErrorResponseDTO,
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteCartItem(
    @Param('id', ParseIntPipe) cartItemId: number,
  ): Promise<Boolean> {
    return await this.cartService.deleteCartItem(cartItemId);
  }
}
