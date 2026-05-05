import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class JWTAccessTokenResponseDTO {
  @ApiProperty({
    description: 'Access токен',
    type: 'string',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzc3OTg1NTY5LCJleHAiOjE3Nzc5OTI3Njl9.UKBELr4CMdAMe4WvznK56NzdvFEKfyP1NTqEMSBu3s8',
  })
  @Expose()
  accessToken!: string;
}
