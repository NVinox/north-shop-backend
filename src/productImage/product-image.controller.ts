import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { FileInterceptor } from '@nestjs/platform-express';

import { CreateProductImageDTO } from './dto/create-product-image.dto';
import { ResponseProductImageDTO } from './dto/response-product-image.dto';
import { ProductImageService } from './product-image.service';

@Controller('product-image')
export class ProductImageController {
  constructor(private readonly productImageService: ProductImageService) {}

  @UseInterceptors(FileInterceptor('image'))
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

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<Boolean> {
    return await this.productImageService.delete(id);
  }
}
