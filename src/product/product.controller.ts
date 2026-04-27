import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ProductService } from './product.service';
import { CreateProductDTO } from './dto/createProduct.dto';
import { UpdateProductDTO } from './dto/updateProduct.dto';
import { ResponseProductDTO } from './dto/responseProduct.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAll(): Promise<ResponseProductDTO[]> {
    const products = await this.productService.getAll();

    return plainToInstance(ResponseProductDTO, products, {
      excludeExtraneousValues: true,
    });
  }

  @Get(':id')
  async getOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseProductDTO> {
    const product = await this.productService.getOne(id);

    return plainToInstance(ResponseProductDTO, product, {
      excludeExtraneousValues: true,
    });
  }

  @Post()
  async create(@Body() dto: CreateProductDTO): Promise<ResponseProductDTO> {
    const product = await this.productService.create(dto);

    return plainToInstance(ResponseProductDTO, product, {
      excludeExtraneousValues: true,
    });
  }

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

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    return await this.productService.delete(id);
  }
}
