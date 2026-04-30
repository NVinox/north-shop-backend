import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { getDatabaseConfig } from './config/database.config';
import { ProductImageModule } from './productImage/product-image.module';
import { serveStaticConfig } from './config/serve-static.config';

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
    ServeStaticModule.forRoot(serveStaticConfig),
    ProductModule,
    ProductImageModule,
    AuthModule,
  ],
})
export class AppModule {}
