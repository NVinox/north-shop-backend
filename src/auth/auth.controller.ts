import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { UserAgent } from 'src/common/decorators/user-agent.decorator';
import { AuthService } from './auth.service';
import { RegisterRequestDTO } from './dto/register-request.dto';
import {
  ErrorResponseDTO,
  ErrorUnauthorizedResponseDTO,
} from 'src/common/dto/error-response.dto';
import { JWTTokensResponseDTO } from './dto/jwt-tokens-response.dto';
import { LoginRequestDTO } from './dto/login-request.dto';

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
    type: JWTTokensResponseDTO,
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
  async register(
    @Body() dto: RegisterRequestDTO,
    @UserAgent() userAgent: string,
  ): Promise<JWTTokensResponseDTO> {
    return await this.authService.register(dto, userAgent);
  }

  @ApiOperation({
    summary: 'Авторизация',
    description: 'Метод авторизации пользователя',
  })
  @ApiOkResponse({
    description: 'Ползователь авторизован',
    type: JWTTokensResponseDTO,
  })
  @ApiBadRequestResponse({
    description: 'Ошибка неправильного запроса',
    type: ErrorResponseDTO,
  })
  @ApiUnauthorizedResponse({
    description: 'Ошибка авторизации',
    type: ErrorUnauthorizedResponseDTO,
  })
  @ApiConflictResponse({
    description: 'Конфликт создания пользователя',
    type: ErrorResponseDTO,
  })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() dto: LoginRequestDTO,
    @UserAgent() userAgent: string,
  ): Promise<JWTTokensResponseDTO> {
    return await this.authService.login(dto, userAgent);
  }
}
