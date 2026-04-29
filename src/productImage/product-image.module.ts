import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductImageEntity } from './entities/productImage.entity';
import { ProductImageService } from './product-image.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductImageEntity])],
  providers: [ProductImageService],
  exports: [ProductImageService],
})
export class ProductImageModule {}
