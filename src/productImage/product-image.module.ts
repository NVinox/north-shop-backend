import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductImageController } from './product-image.controller';

import { ProductImageEntity } from './entities/product-image.entity';
import { ProductImageService } from './product-image.service';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductImageEntity]),
    forwardRef(() => ProductModule),
  ],
  controllers: [ProductImageController],
  providers: [ProductImageService],
  exports: [ProductImageService],
})
export class ProductImageModule {}
