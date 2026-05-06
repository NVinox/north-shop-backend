import { ApiProperty } from '@nestjs/swagger';

class ErrorUnauthorizedDTO {
  @ApiProperty({
    description: 'Описания ошибок',
    type: 'string',
    example: 'Email or password incorrect',
  })
  message!: string;

  @ApiProperty({
    description: 'Сообщение ошибки',
    type: 'string',
    example: 'Unauthorized',
  })
  error!: string;

  @ApiProperty({
    description: 'Сообщение ошибки',
    type: 'integer',
    example: 401,
  })
  statusCode!: number;
}

class ErrorDTO {
  @ApiProperty({
    description: 'Описания ошибок',
    type: [String],
    example: ['example error 1', 'example error 2'],
  })
  message!: string[];

  @ApiProperty({
    description: 'Сообщение ошибки',
    type: 'string',
    example: 'Bad Request',
  })
  error!: string;

  @ApiProperty({
    description: 'Сообщение ошибки',
    type: 'integer',
    example: 400,
  })
  statusCode!: number;
}

export class ErrorResponseDTO {
  @ApiProperty({
    description: 'Статус код ошибки',
    type: 'integer',
    example: 400,
  })
  statusCode!: number;

  @ApiProperty({
    description: 'Статус ошибки',
    type: 'string',
    example: 'ERROR',
  })
  status!: string;

  @ApiProperty({
    description: 'Данные с сервера',
    type: 'null',
    nullable: true,
    example: null,
  })
  data: any;

  @ApiProperty({
    description: 'Объект ошибки',
    type: () => ErrorDTO,
  })
  error!: ErrorDTO;
}

export class ErrorUnauthorizedResponseDTO {
  @ApiProperty({
    description: 'Статус код ошибки',
    type: 'integer',
    example: 401,
  })
  statusCode!: number;

  @ApiProperty({
    description: 'Статус ошибки',
    type: 'string',
    example: 'ERROR',
  })
  status!: string;

  @ApiProperty({
    description: 'Данные с сервера',
    type: 'null',
    nullable: true,
    example: null,
  })
  data: any;

  @ApiProperty({
    description: 'Объект ошибки',
    type: () => ErrorUnauthorizedDTO,
  })
  error!: ErrorUnauthorizedDTO;
}
