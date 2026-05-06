import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import type { Response } from 'express';
import { DataSource, Repository } from 'typeorm';
import ms, { StringValue } from 'ms';
import * as bcrypt from 'bcrypt';

import { EUserRole } from './enums/user-role.enum';

import { UserEntity } from './entities/user.entity';
import { JWTTokensResponseDTO } from './dto/jwt-tokens-response.dto';
import { JWTAccessTokenResponseDTO } from './dto/jwt-access-token-response.dto';
import { RegisterRequestDTO } from './dto/register-request.dto';
import { IJwtPayload } from './interfaces/jwt.interface';
import { RefreshTokenService } from 'src/refresh-token/refresh-token.service';
import { LoginRequestDTO } from './dto/login-request.dto';
import { isDev } from 'src/utils/is-dev.util';

@Injectable()
export class AuthService {
  private readonly SALT_ROUNDS: number;

  private readonly JWT_ACCESS_TOKEN_SECRET: string;
  private readonly JWT_REFRESH_TOKEN_SECRET: string;

  private readonly JWT_ACCESS_TOKEN_TTL: string;
  private readonly JWT_REFRESH_TOKEN_TTL: string;

  private readonly COOKIE_DOMAIN: string;

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly dataSource: DataSource,
  ) {
    this.SALT_ROUNDS =
      +this.configService.getOrThrow<string>('BCRYPT_SALT_ROUNDS');

    this.JWT_ACCESS_TOKEN_TTL = this.configService.getOrThrow<string>(
      'JWT_ACCESS_TOKEN_TTL',
    );
    this.JWT_REFRESH_TOKEN_TTL = this.configService.getOrThrow<string>(
      'JWT_REFRESH_TOKEN_TTL',
    );
    this.JWT_ACCESS_TOKEN_SECRET = this.configService.getOrThrow<string>(
      'JWT_ACCESS_TOKEN_SECRET',
    );
    this.JWT_REFRESH_TOKEN_SECRET = this.configService.getOrThrow<string>(
      'JWT_REFRESH_TOKEN_SECRET',
    );
    this.COOKIE_DOMAIN = this.configService.getOrThrow<string>('COOKIE_DOMAIN');
  }

  async register(
    res: Response,
    dto: RegisterRequestDTO,
    userAgent: string,
  ): Promise<JWTAccessTokenResponseDTO> {
    return await this.dataSource.transaction(async (manager) => {
      await this.isExistUser(dto.email);

      const hash = await this.hashPassword(dto.password);
      const memoryUser = manager.create(UserEntity, {
        ...dto,
        password: hash,
      });
      const createdUser = await manager.save(memoryUser);
      const { accessToken, refreshToken } = this.generateTokens(
        createdUser.id,
        createdUser.role,
      );

      this.setCookie(res, refreshToken);

      await this.refreshTokenService.create(
        {
          userId: createdUser.id,
          token: refreshToken,
          userAgent,
        },
        manager,
      );

      return { accessToken };
    });
  }

  async login(
    res: Response,
    dto: LoginRequestDTO,
    userAgent: string,
  ): Promise<JWTAccessTokenResponseDTO> {
    const user = await this.userRepository.findOneBy({ email: dto.email });

    if (!user) {
      throw new UnauthorizedException('Email or password incorrect');
    }

    const isComparePasswords = await bcrypt.compare(
      dto.password,
      user.password,
    );

    if (!isComparePasswords) {
      throw new UnauthorizedException('Email or password incorrect');
    }

    const { accessToken, refreshToken } = this.generateTokens(
      user.id,
      user.role,
    );

    this.setCookie(res, refreshToken);

    await this.refreshTokenService.create({
      userId: user.id,
      token: refreshToken,
      userAgent,
    });

    return { accessToken };
  }

  async refresh(
    res: Response,
    userId: number,
    userAgent: string,
    token: string,
  ): Promise<JWTAccessTokenResponseDTO> {
    const session = await this.refreshTokenService.getOne(userId, userAgent);

    const isMatch = await bcrypt.compare(token, session.hash);

    if (!isMatch) {
      await this.refreshTokenService.delete(session);
      throw new UnauthorizedException('Token manipulation detected');
    }

    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { accessToken, refreshToken } = this.generateTokens(
      user.id,
      user.role,
    );

    this.setCookie(res, refreshToken);

    await this.refreshTokenService.create({
      userId: user.id,
      token: refreshToken,
      userAgent,
    });

    return { accessToken };
  }

  private calculateRefreshExpires(isCalculate: boolean = true): Date {
    if (isCalculate) {
      return new Date(
        Date.now() + ms(this.JWT_REFRESH_TOKEN_TTL as StringValue),
      );
    }

    return new Date();
  }

  private setCookie(
    res: Response,
    value: string,
    expires: Date = this.calculateRefreshExpires(),
  ) {
    res.cookie('refreshToken', value, {
      httpOnly: true,
      domain: this.COOKIE_DOMAIN,
      secure: !isDev(this.configService),
      sameSite: isDev(this.configService) ? 'none' : 'lax',
      path: 'api/auth',
      expires,
    });
  }

  private generateTokens(id: number, role: EUserRole): JWTTokensResponseDTO {
    const payload: IJwtPayload = {
      id,
      role,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: this.JWT_ACCESS_TOKEN_TTL as any,
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: this.JWT_REFRESH_TOKEN_TTL as any,
    });

    return { accessToken, refreshToken };
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.SALT_ROUNDS);
  }

  private async isExistUser(email: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ email });

    if (user) {
      throw new ConflictException('User with this email already exists');
    }
  }
}
