import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductService {
  getAll() {}

  getOne(id: number) {}

  create() {}

  update() {}

  patchUpdate() {}

  delete(id: number): boolean {
    return true;
  }
}
