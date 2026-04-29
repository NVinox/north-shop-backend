import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('North Shop API')
    .setDescription('API documentation for North Shop')
    .setVersion('1.0.0')
    .setContact('NVinox', 'https://github.com/NVinox', 'vomilk24@gmail.com')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/api/docs', app, document, {
    jsonDocumentUrl: 'api/swagger.json',
    customSiteTitle: 'North Shop OpenAPI',
  });
}
