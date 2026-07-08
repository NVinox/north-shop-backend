import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CartItemService } from './cart-item.service';
import { CartItemController } from './cart-item.controller';
import { CartEntityItem } from './entities/cart-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CartEntityItem])],
  controllers: [CartItemController],
  providers: [CartItemService],
})
export class CartItemModule {}
