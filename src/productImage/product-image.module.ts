import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductImageEntity } from './entities/product-image.entity';
import { ProductImageService } from './product-image.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductImageEntity])],
  providers: [ProductImageService],
  exports: [ProductImageService],
})
export class ProductImageModule {}
