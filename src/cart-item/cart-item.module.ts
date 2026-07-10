import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CartItemService } from './cart-item.service';
import { CartEntityItem } from './entities/cart-item.entity';
import { ProductModule } from 'src/product/product.module';
import { CartModule } from 'src/cart/cart.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CartEntityItem]),
    forwardRef(() => CartModule),
    ProductModule,
  ],
  providers: [CartItemService],
  exports: [CartItemService],
})
export class CartItemModule {}
