import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductEntity } from './entities/product.entity';
import { ProductImageModule } from 'src/productImage/product-image.module';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity]),
    forwardRef(() => ProductImageModule),
  ],
  controllers: [ProductController],
  providers: [ProductService, JwtAuthGuard, RolesGuard],
  exports: [ProductService],
})
export class ProductModule {}
