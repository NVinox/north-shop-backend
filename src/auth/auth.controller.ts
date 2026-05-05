import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { RegisterRequestDTO } from './dto/register-request.dto';
import { ErrorResponseDTO } from 'src/common/dto/error-response.dto';
import { IJwtTokens } from './interfaces/jwt.interface';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Регистрация',
    description: 'Метод регистрации пользователя',
  })
  @ApiCreatedResponse({
    description: 'Ползователь зарегистрирован',
    type: 'boolean',
    example: true,
  })
  @ApiBadRequestResponse({
    description: 'Ошибка неправильного запроса',
    type: ErrorResponseDTO,
  })
  @ApiConflictResponse({
    description: 'Конфликт создания пользователя',
    type: ErrorResponseDTO,
  })
  @Post('register')
  async register(@Body() dto: RegisterRequestDTO): Promise<IJwtTokens> {
    return await this.authService.register(dto);
  }
}
