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
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { ProductService } from './product.service';

import { ApiPaginatedResponse } from 'src/common/decorators/apiPaginatedResponse.decorator';

import { CreateProductDTO } from './dto/createProduct.dto';
import { UpdateProductDTO } from './dto/updateProduct.dto';
import { ResponseProductDTO } from './dto/responseProduct.dto';
import { PaginationResponseDTO } from 'src/common/dto/paginationResponse.dto';
import { QueryProductDTO } from './dto/queryProduct.dto';
import { PaginationMetaDTO } from 'src/common/dto/paginationMeta.dto';
import { ErrorResponseDTO } from 'src/common/dto/errorResponse.dto';

@ApiTags('Продукты')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({
    summary: 'Получение списка прдуктов',
    description: 'Метод получения списка продуктов',
  })
  @ApiExtraModels(PaginationResponseDTO, ResponseProductDTO, PaginationMetaDTO)
  @ApiPaginatedResponse(ResponseProductDTO)
  @Get()
  async getAll(
    @Query() query: QueryProductDTO,
  ): Promise<PaginationResponseDTO<ResponseProductDTO>> {
    const result = await this.productService.getAll(query);

    return {
      items: plainToInstance(ResponseProductDTO, result.items, {
        excludeExtraneousValues: true,
      }),
      meta: result.meta,
    };
  }

  @ApiOperation({
    summary: 'Получение прдукта',
    description: 'Метод получения продукта по id',
  })
  @ApiParam({ name: 'id', type: 'integer', description: 'ID продукта' })
  @ApiOkResponse({ description: 'Продукт найден', type: ResponseProductDTO })
  @ApiBadRequestResponse({
    description: 'Ошибка неправильного запроса',
    type: ErrorResponseDTO,
  })
  @ApiNotFoundResponse({
    description: 'Продукт не найден',
    type: ErrorResponseDTO,
  })
  @Get(':id')
  async getOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseProductDTO> {
    const product = await this.productService.getOne(id);

    return plainToInstance(ResponseProductDTO, product, {
      excludeExtraneousValues: true,
    });
  }

  @ApiOperation({
    summary: 'Создание продукта',
    description: 'Метод создания продукта',
  })
  @ApiCreatedResponse({
    description: 'Продукт создан',
    type: ResponseProductDTO,
  })
  @ApiBadRequestResponse({
    description: 'Ошибка неправильного запроса',
    type: ErrorResponseDTO,
  })
  @ApiConflictResponse({
    description: 'Конфликт создания продукта',
    type: ErrorResponseDTO,
  })
  @Post()
  async create(@Body() dto: CreateProductDTO): Promise<ResponseProductDTO> {
    const product = await this.productService.create(dto);

    return plainToInstance(ResponseProductDTO, product, {
      excludeExtraneousValues: true,
    });
  }

  @ApiOperation({
    summary: 'Обновление продукта',
    description: 'Метод обновления продукта',
  })
  @ApiOkResponse({ description: 'Продукт обновлен', type: ResponseProductDTO })
  @ApiBadRequestResponse({
    description: 'Ошибка неправильного запроса',
    type: ErrorResponseDTO,
  })
  @ApiNotFoundResponse({
    description: 'Продукт не найден',
    type: ErrorResponseDTO,
  })
  @ApiConflictResponse({
    description: 'Конфликт создания продукта',
    type: ErrorResponseDTO,
  })
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDTO,
  ): Promise<ResponseProductDTO> {
    const product = await this.productService.update(id, dto);

    return plainToInstance(ResponseProductDTO, product, {
      excludeExtraneousValues: true,
    });
  }

  @ApiOperation({
    summary: 'Удаление продукта',
    description: 'Метод удаления продукта',
  })
  @ApiOkResponse({ description: 'Продукт удален', type: Boolean })
  @ApiBadRequestResponse({
    description: 'Ошибка неправильного запроса',
    type: ErrorResponseDTO,
  })
  @ApiNotFoundResponse({
    description: 'Продукт не найден',
    type: ErrorResponseDTO,
  })
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    return await this.productService.delete(id);
  }
}
