import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

import { LoginRequestDTO } from './login-request.dto';

export class RegisterRequestDTO extends LoginRequestDTO {
  @ApiProperty({
    description: 'Имя пользователя',
    type: 'string',
    example: 'Сергей',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name!: string;
}
