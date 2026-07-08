import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CartEntity } from './entities/cart.entity';
import { CartItemModule } from 'src/cart-item/cart-item.module';

@Module({
  imports: [TypeOrmModule.forFeature([CartEntity]), CartItemModule],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
