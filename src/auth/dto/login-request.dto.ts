import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginRequestDTO {
  @ApiProperty({
    description: 'Email пользователя',
    type: 'string',
    example: 'example@gmail.com',
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    description: 'Пароль пользователя',
    type: 'string',
    example: 'qwerty123',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(128)
  password!: string;
}
