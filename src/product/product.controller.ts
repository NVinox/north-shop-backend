import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { plainToInstance } from 'class-transformer';
import { ProductService } from './product.service';

import { ApiPaginatedResponse } from 'src/common/decorators/api-paginated-response.decorator';
import { Roles } from 'src/common/decorators/roles-decorator';

import { CreateProductDTO } from './dto/create-product.dto';
import { UpdateProductDTO } from './dto/update-product.dto';
import { PaginationResponseDTO } from 'src/common/dto/pagination-response.dto';
import { QueryProductDTO } from './dto/query-product.dto';
import { PaginationMetaDTO } from 'src/common/dto/pagination-meta.dto';
import { ErrorResponseDTO } from 'src/common/dto/error-response.dto';
import { ResponseProductListDTO } from './dto/response-product-list.dto';
import { ResponseProductOneDTO } from './dto/response-product-one.dto';

import { EUserRole } from 'src/common/enums/user-role.enum';

import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

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
    description: 'Метод получения продукта по slug',
  })
  @ApiParam({ name: 'slug', type: 'string', description: 'SLUG продукта' })
  @ApiOkResponse({ description: 'Продукт найден', type: ResponseProductOneDTO })
  @ApiBadRequestResponse({
    description: 'Ошибка неправильного запроса',
    type: ErrorResponseDTO,
  })
  @ApiNotFoundResponse({
    description: 'Продукт не найден',
    type: ErrorResponseDTO,
  })
  @Get('/by-slug/:slug')
  async getOneBySlug(
    @Param('slug') slug: string,
  ): Promise<ResponseProductOneDTO> {
    const product = await this.productService.getOneBySlug(slug);

    return plainToInstance(ResponseProductOneDTO, product, {
      excludeExtraneousValues: true,
    });
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
  @Get('/by-id/:id')
  async getOneByid(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseProductOneDTO> {
    const product = await this.productService.getOneById(id);

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
  @ApiForbiddenResponse({
    description: 'Недостаточно прав',
    type: ErrorResponseDTO,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(EUserRole.ADMIN, EUserRole.MANAGER)
  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  async create(
    @Body() dto: CreateProductDTO,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|webp)$' }),
        ],
        fileIsRequired: false,
      }),
    )
    files: Express.Multer.File[],
  ): Promise<ResponseProductOneDTO> {
    const product = await this.productService.create(dto, files);

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
  @ApiForbiddenResponse({
    description: 'Недостаточно прав',
    type: ErrorResponseDTO,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(EUserRole.ADMIN, EUserRole.MANAGER)
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
  @ApiForbiddenResponse({
    description: 'Недостаточно прав',
    type: ErrorResponseDTO,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(EUserRole.ADMIN, EUserRole.MANAGER)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    return await this.productService.delete(id);
  }
}
