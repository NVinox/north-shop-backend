import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';

import { UserAgent } from 'src/common/decorators/user-agent.decorator';
import { AuthService } from './auth.service';
import { RegisterRequestDTO } from './dto/register-request.dto';
import {
  ErrorResponseDTO,
  ErrorUnauthorizedResponseDTO,
} from 'src/common/dto/error-response.dto';
import { LoginRequestDTO } from './dto/login-request.dto';
import { JWTAccessTokenResponseDTO } from './dto/jwt-access-token-response.dto';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';

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
    type: JWTAccessTokenResponseDTO,
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
    @Res({ passthrough: true }) res: Response,
    @Body() dto: RegisterRequestDTO,
    @UserAgent() userAgent: string,
  ): Promise<JWTAccessTokenResponseDTO> {
    return await this.authService.register(res, dto, userAgent);
  }

  @ApiOperation({
    summary: 'Авторизация',
    description: 'Метод авторизации пользователя',
  })
  @ApiOkResponse({
    description: 'Ползователь авторизован',
    type: JWTAccessTokenResponseDTO,
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
    @Res({ passthrough: true }) res: Response,
    @Body() dto: LoginRequestDTO,
    @UserAgent() userAgent: string,
  ): Promise<JWTAccessTokenResponseDTO> {
    return await this.authService.login(res, dto, userAgent);
  }

  @ApiOperation({
    summary: 'Ротация токенов',
    description: 'Метод ротации токенов',
  })
  @ApiOkResponse({
    description: 'Токены обновлены',
    type: JWTAccessTokenResponseDTO,
  })
  @ApiBadRequestResponse({
    description: 'Ошибка неправильного запроса',
    type: ErrorResponseDTO,
  })
  @ApiUnauthorizedResponse({
    description: 'Ошибка авторизации',
    type: ErrorUnauthorizedResponseDTO,
  })
  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(
    @Res({ passthrough: true }) res: Response,
    @Req() req,
    @UserAgent() userAgent: string,
  ): Promise<JWTAccessTokenResponseDTO> {
    return await this.authService.refresh(
      res,
      req.user.id,
      userAgent,
      req.user.refreshToken,
    );
  }
}
