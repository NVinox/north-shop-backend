import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { getDatabaseConfig } from './config/database.config';
import { ProductImageModule } from './productImage/product-image.module';
import { serveStaticConfig } from './config/serve-static.config';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';
import { ReviewModule } from './review/review.module';
import { CartModule } from './cart/cart.module';
import { CartItemModule } from './cart-item/cart-item.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}.local`,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getDatabaseConfig,
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    ServeStaticModule.forRoot(serveStaticConfig),
    ProductModule,
    ProductImageModule,
    AuthModule,
    RefreshTokenModule,
    ReviewModule,
    CartModule,
    CartItemModule,
  ],
})
export class AppModule {}
