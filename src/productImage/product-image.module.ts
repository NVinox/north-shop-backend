import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductImageController } from './product-image.controller';

import { ProductImageService } from './product-image.service';
import { ProductModule } from 'src/product/product.module';
import { RolesGuard } from 'src/common/guards/roles.guard';

import { ProductImageEntity } from './entities/product-image.entity';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductImageEntity]),
    forwardRef(() => ProductModule),
  ],
  controllers: [ProductImageController],
  providers: [ProductImageService, RolesGuard, JwtAuthGuard],
  exports: [ProductImageService],
})
export class ProductImageModule {}
