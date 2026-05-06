import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { JWTAccessTokenResponseDTO } from './jwt-access-token-response.dto';

export class JWTTokensResponseDTO extends JWTAccessTokenResponseDTO {
  @ApiProperty({
    description: 'Refresh токен',
    type: 'string',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzc3OTg1NTY5LCJleHAiOjE3Nzg1OTAzNjl9.R6b9_JpBOroGKJnnWr1GVZwg82axTO_S9Z3Sa5jHFQ8',
  })
  @Expose()
  refreshToken!: string;
}
