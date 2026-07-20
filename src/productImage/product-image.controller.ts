import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { FileInterceptor } from '@nestjs/platform-express';

import { CreateProductImageDTO } from './dto/create-product-image.dto';
import { UpdateProductImageDTO } from './dto/update-product-image.dto';
import { ResponseProductImageDTO } from './dto/response-product-image.dto';

import { ProductImageService } from './product-image.service';

import { Roles } from 'src/common/decorators/roles-decorator';

import { EUserRole } from 'src/common/enums/user-role.enum';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ErrorResponseDTO } from 'src/common/dto/error-response.dto';

@ApiTags('Изображения подукта')
@Controller('product-image')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductImageController {
  constructor(private readonly productImageService: ProductImageService) {}

  @ApiOperation({
    summary: 'Создание изображения продукта',
    description: 'Метод создания изображения продукта',
  })
  @ApiCreatedResponse({
    description: 'Изображение создано',
    type: ResponseProductImageDTO,
  })
  @ApiBadRequestResponse({
    description: 'Ошибка неправильного запроса',
    type: ErrorResponseDTO,
  })
  @ApiForbiddenResponse({
    description: 'Недостаточно прав',
    type: ErrorResponseDTO,
  })
  @ApiBearerAuth('access-token')
  @UseInterceptors(FileInterceptor('image'))
  @Roles(EUserRole.MANAGER, EUserRole.ADMIN)
  @Post()
  async create(
    @Body() dto: CreateProductImageDTO,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|webp)$' }),
        ],
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
  ): Promise<ResponseProductImageDTO> {
    const image = await this.productImageService.create(dto, file);

    return plainToInstance(ResponseProductImageDTO, image, {
      excludeExtraneousValues: true,
    });
  }

  @ApiOperation({
    summary: 'Обновление изображения продукта',
    description: 'Метод обновления изображения продукта по id',
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'ID изображения продукта',
  })
  @ApiOkResponse({
    description: 'Изображение обновлено',
    type: ResponseProductImageDTO,
  })
  @ApiBadRequestResponse({
    description: 'Ошибка неправильного запроса',
    type: ErrorResponseDTO,
  })
  @ApiNotFoundResponse({
    description: 'Изображение не найдено',
    type: ErrorResponseDTO,
  })
  @ApiForbiddenResponse({
    description: 'Недостаточно прав',
    type: ErrorResponseDTO,
  })
  @ApiBearerAuth('access-token')
  @Roles(EUserRole.MANAGER, EUserRole.ADMIN)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductImageDTO,
  ): Promise<ResponseProductImageDTO> {
    const image = await this.productImageService.update(id, dto);

    return plainToInstance(ResponseProductImageDTO, image, {
      excludeExtraneousValues: true,
    });
  }

  @ApiOperation({
    summary: 'Удаление изображения продукта',
    description: 'Метод удаления изображения продукта по id',
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'ID изображения продукта',
  })
  @ApiOkResponse({
    description: 'Изображение удалено',
    type: ResponseProductImageDTO,
  })
  @ApiBadRequestResponse({
    description: 'Ошибка неправильного запроса',
    type: ErrorResponseDTO,
  })
  @ApiNotFoundResponse({
    description: 'Изображение не найдено',
    type: ErrorResponseDTO,
  })
  @ApiForbiddenResponse({
    description: 'Недостаточно прав',
    type: ErrorResponseDTO,
  })
  @ApiBearerAuth('access-token')
  @Roles(EUserRole.MANAGER, EUserRole.ADMIN)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<Boolean> {
    return await this.productImageService.delete(id);
  }
}
