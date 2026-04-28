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
import { ResponseProductListDTO } from './dto/responseProductList.dto';
import { ResponseProductOneDTO } from './dto/responseProductOne.dto';

@ApiTags('Продукты')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({
    summary: 'Получение списка продуктов',
    description: 'Метод получения списка продуктов',
  })
  @ApiExtraModels(
    PaginationResponseDTO,
    ResponseProductListDTO,
    PaginationMetaDTO,
  )
  @ApiPaginatedResponse(ResponseProductListDTO)
  @Get()
  async getAll(
    @Query() query: QueryProductDTO,
  ): Promise<PaginationResponseDTO<ResponseProductListDTO>> {
    const result = await this.productService.getAll(query);

    return {
      items: plainToInstance(ResponseProductListDTO, result.items, {
        excludeExtraneousValues: true,
      }),
      meta: result.meta,
    };
  }

  @ApiOperation({
    summary: 'Получение продукта',
    description: 'Метод получения продукта по id',
  })
  @ApiParam({ name: 'id', type: 'integer', description: 'ID продукта' })
  @ApiOkResponse({ description: 'Продукт найден', type: ResponseProductOneDTO })
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
  ): Promise<ResponseProductOneDTO> {
    const product = await this.productService.getOne(id);

    return plainToInstance(ResponseProductOneDTO, product, {
      excludeExtraneousValues: true,
    });
  }

  @ApiOperation({
    summary: 'Создание продукта',
    description: 'Метод создания продукта',
  })
  @ApiCreatedResponse({
    description: 'Продукт создан',
    type: ResponseProductOneDTO,
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
  async create(@Body() dto: CreateProductDTO): Promise<ResponseProductOneDTO> {
    const product = await this.productService.create(dto);

    return plainToInstance(ResponseProductOneDTO, product, {
      excludeExtraneousValues: true,
    });
  }

  @ApiOperation({
    summary: 'Обновление продукта',
    description: 'Метод обновления продукта',
  })
  @ApiOkResponse({
    description: 'Продукт обновлен',
    type: ResponseProductOneDTO,
  })
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
  ): Promise<ResponseProductOneDTO> {
    const product = await this.productService.update(id, dto);

    return plainToInstance(ResponseProductOneDTO, product, {
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
