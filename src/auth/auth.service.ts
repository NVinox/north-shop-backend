import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { ConflictException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { UserEntity } from './entities/user.entity';
import { RegisterRequestDTO } from './dto/register-request.dto';

@Injectable()
export class AuthService {
  private readonly saltRounds: number;

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly configService: ConfigService,
  ) {
    this.saltRounds =
      +this.configService.getOrThrow<string>('BCRYPT_SALT_ROUNDS');
  }

  async register(dto: RegisterRequestDTO): Promise<boolean> {
    await this.isExistUser(dto.email);

    const hash = await this.hashPassword(dto.password);
    const memoryUser = this.userRepository.create({
      name: dto.name,
      email: dto.email,
      password: hash,
    });

    await this.userRepository.save(memoryUser);

    return true;
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.saltRounds);
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
