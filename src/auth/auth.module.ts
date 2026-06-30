import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UserEntity } from './entities/user.entity';

import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { JwtAuthStrategy } from 'src/common/strategies/jwt-auth.strategy';

import { getJwtConfig } from 'src/config/jwt.config';
import { RefreshTokenModule } from 'src/refresh-token/refresh-token.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

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
  providers: [
    AuthService,
    JwtRefreshStrategy,
    JwtAuthStrategy,
    JwtAuthGuard,
    JwtRefreshGuard,
  ],
  exports: [AuthService],
})
export class AuthModule {}
