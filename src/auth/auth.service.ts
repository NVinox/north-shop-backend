import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { ConflictException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { EUserRole } from './enums/user-role.enum';

import { UserEntity } from './entities/user.entity';
import { RegisterRequestDTO } from './dto/register-request.dto';
import { IJwtPayload, IJwtTokens } from './interfaces/jwt.interface';

@Injectable()
export class AuthService {
  private readonly SALT_ROUNDS: number;

  private readonly JWT_ACCESS_TOKEN_TTL: string;
  private readonly JWT_REFRESH_TOKEN_TTL: string;

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.SALT_ROUNDS =
      +this.configService.getOrThrow<string>('BCRYPT_SALT_ROUNDS');

    ((this.JWT_ACCESS_TOKEN_TTL = this.configService.getOrThrow<string>(
      'JWT_ACCESS_TOKEN_TTL',
    )),
      (this.JWT_REFRESH_TOKEN_TTL = this.configService.getOrThrow<string>(
        'JWT_REFRESH_TOKEN_TTL',
      )));
  }

  async register(dto: RegisterRequestDTO): Promise<IJwtTokens> {
    await this.isExistUser(dto.email);

    const hash = await this.hashPassword(dto.password);
    const memoryUser = this.userRepository.create({
      ...dto,
      password: hash,
    });
    const createdUser = await this.userRepository.save(memoryUser);

    return this.generateTokens(createdUser.id, createdUser.role);
  }

  private generateTokens(id: number, role: EUserRole): IJwtTokens {
    const payload: IJwtPayload = {
      id,
      role,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.JWT_ACCESS_TOKEN_TTL as any,
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.JWT_REFRESH_TOKEN_TTL as any,
    });

    return { accessToken, refreshToken };
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.SALT_ROUNDS);
  }

  private async comparePasswords(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  private async isExistUser(email: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ email });

    if (user) {
      throw new ConflictException('User with this email already exists');
    }
  }
}
