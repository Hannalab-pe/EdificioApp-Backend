import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  // configuracion global
  app.enableCors({
    origin:
      process.env.NODE_ENV === 'production'
        ? [
            'http://localhost:3000',
            'http://localhost:4200',
            'https://security-service-369655188501.us-central1.run.app',
          ]
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
  const port = configService.get('PORT') || 3000;

  await app.listen(port);
}
bootstrap();
