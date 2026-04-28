import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductImageEntity } from './entities/productImage.entity';

@Module({ imports: [TypeOrmModule.forFeature([ProductImageEntity])] })
export class ProductImageModule {}
