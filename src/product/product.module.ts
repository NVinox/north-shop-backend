import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductEntity } from './entities/product.entity';
import { ProductImageModule } from 'src/productImage/product-image.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity]), ProductImageModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
