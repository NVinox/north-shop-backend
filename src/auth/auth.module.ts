import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UserEntity } from './entities/user.entity';

import { getJwtConfig } from 'src/config/jwt.config';
import { RefreshTokenModule } from 'src/refresh-token/refresh-token.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: getJwtConfig,
      inject: [ConfigService],
    }),
    RefreshTokenModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtRefreshStrategy, JwtRefreshGuard],
})
export class AuthModule {}
