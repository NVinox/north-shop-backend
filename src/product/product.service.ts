import { Injectable } from '@nestjs/common';
import { CreateProductDTO } from './dto/createProduct.dto';
import { UpdateProductDTO } from './dto/updateProduct.dto';

@Injectable()
export class ProductService {
  getAll() {}

  getOne(id: number) {}

  create(dto: CreateProductDTO) {}

  update(id: number, dto: UpdateProductDTO) {}

  delete(id: number): boolean {
    return true;
  }
}
