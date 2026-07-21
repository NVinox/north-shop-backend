import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { ReviewService } from './review.service';

import { CreateReviewDTO } from './dto/create-review.dto';
import { ResponseReviewDTO } from './dto/response-review.dto';

import { PaginationResponseDTO } from 'src/common/dto/pagination-response.dto';
import { PaginationQueryDTO } from 'src/common/dto/pagination-query.dto';
import { PaginationMetaDTO } from 'src/common/dto/pagination-meta.dto';

import { ApiPaginatedResponse } from 'src/common/decorators/api-paginated-response.decorator';
import { ErrorResponseDTO } from 'src/common/dto/error-response.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles-decorator';
import { EUserRole } from 'src/common/enums/user-role.enum';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@ApiTags('Отзывы')
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @ApiOperation({
    summary: 'Получение отзывов',
    description: 'Метод получения отзывов по id продукта',
  })
  @ApiParam({ name: 'productId', type: 'integer', description: 'ID продукта' })
  @ApiExtraModels(PaginationResponseDTO, ResponseReviewDTO, PaginationMetaDTO)
  @ApiPaginatedResponse(ResponseReviewDTO)
  @ApiNotFoundResponse({
    description: 'Отзыв не найден',
    type: ErrorResponseDTO,
  })
  @Get(':productId')
  async getAllByProduct(
    @Param('productId', ParseIntPipe) productId: number,
    @Query() query: PaginationQueryDTO,
  ): Promise<PaginationResponseDTO<ResponseReviewDTO>> {
    const result = await this.reviewService.getAllByProduct(productId, query);

    return {
      items: plainToInstance(ResponseReviewDTO, result.items, {
        excludeExtraneousValues: true,
      }),
      meta: result.meta,
    };
  }

  @ApiOperation({
    summary: 'Создание отзыва',
    description: 'Метод создания отзыва',
  })
  @ApiOkResponse({ description: 'Отзыв создан', type: ResponseReviewDTO })
  @ApiBadRequestResponse({
    description: 'Ошибка неправильного запроса',
    type: ErrorResponseDTO,
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() dto: CreateReviewDTO,
    @CurrentUser('id') userId: number,
  ): Promise<ResponseReviewDTO> {
    const review = await this.reviewService.create(dto, userId);

    return plainToInstance(ResponseReviewDTO, review, {
      excludeExtraneousValues: true,
    });
  }

  @ApiOperation({
    summary: 'Удаление отзыва',
    description: 'Метод удаления отзыва',
  })
  @ApiParam({ name: 'id', type: 'integer', description: 'ID отзыва' })
  @ApiOkResponse({ description: 'Отзыв удален', type: Boolean })
  @ApiBadRequestResponse({
    description: 'Ошибка неправильного запроса',
    type: ErrorResponseDTO,
  })
  @ApiForbiddenResponse({
    description: 'Недостаточно прав',
    type: ErrorResponseDTO,
  })
  @ApiNotFoundResponse({
    description: 'Отзыв не найден',
    type: ErrorResponseDTO,
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(EUserRole.MANAGER, EUserRole.ADMIN)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    return await this.reviewService.delete(id);
  }
}
