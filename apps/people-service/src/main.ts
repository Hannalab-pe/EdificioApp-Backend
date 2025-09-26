import { NestFactory } from '@nestjs/core';
import { PeopleServiceModule } from './people-service.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(PeopleServiceModule);
  app.enableCors({
    origin:
      process.env.NODE_ENV === 'production'
        ? ['http://localhost:3000', 'http://localhost:4200']
        : '*',
    credentials: true,
  });

  // pipes de validacion sirve para los dto y validaciones de datos de entrada
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // prefijo global para todas las rutas
  app.setGlobalPrefix('api/v1');

  // Configuración de Swagger
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Condominio System API')
      .setDescription('API Gateway para el sistema de condominios')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  const configService = app.get(ConfigService);
  const port = configService.get('PEOPLE_SERVICE_PORT');

  await app.listen(port);
}
bootstrap();
