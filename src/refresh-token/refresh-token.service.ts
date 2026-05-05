import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import ms, { StringValue } from 'ms';

import { RefreshTokenEntity } from './entities/refresh-token.entity';
import { CreateRefreshTokenDTO } from './dto/create-refresh-token.dto';

@Injectable()
export class RefreshTokenService {
  private readonly SALT_ROUNDS: number;
  private readonly JWT_REFRESH_TOKEN_TTL: string;

  constructor(
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokenRepository: Repository<RefreshTokenEntity>,
    private readonly configService: ConfigService,
  ) {
    this.SALT_ROUNDS =
      +this.configService.getOrThrow<string>('BCRYPT_SALT_ROUNDS');

    this.JWT_REFRESH_TOKEN_TTL = this.configService.getOrThrow<string>(
      'JWT_REFRESH_TOKEN_TTL',
    );
  }

  async create(
    dto: CreateRefreshTokenDTO,
    manager?: EntityManager,
  ): Promise<boolean> {
    const hash = await this.hashToken(dto.token);
    const expiresAt = new Date(
      Date.now() + ms(this.JWT_REFRESH_TOKEN_TTL as StringValue),
    );
    const data = {
      userId: dto.userId,
      userAgent: dto.userAgent,
      expiresAt,
      hash,
    };

    if (manager) {
      const memoryToken = manager.create(RefreshTokenEntity, data);
      await manager.save(RefreshTokenEntity, memoryToken);
    } else {
      const memoryToken = this.refreshTokenRepository.create(data);
      await this.refreshTokenRepository.save(memoryToken);
    }

    return true;
  }

  private async hashToken(token: string): Promise<string> {
    return await bcrypt.hash(token, this.SALT_ROUNDS);
  }
}
