import { NestFactory } from '@nestjs/core';
import { SecurityServiceModule } from './security-service.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(SecurityServiceModule);

  // configuracion global
  app.enableCors({
    origin: process.env.NODE_ENV === 'production' ?
      ['http://localhost:3000', 'http://localhost:4200'] :
      '*',
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
      .setTitle('Security Service API')
      .setDescription('Servicio de Seguridad para el sistema de condominios - Autenticación y Autorización')
      .setVersion('1.0')
      .addTag('Authentication', 'Endpoints de autenticación')
      .addTag('Security Service', 'Información del servicio')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        'JWT-auth'
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  const configService = app.get(ConfigService);
  const port = configService.get('AUTH_SERVICE_PORT') || 3001; // Puerto diferente al API Gateway

  await app.listen(port);
  console.log(`🚀 Security Service running on: http://localhost:${port}`);
  console.log(`📚 Swagger docs available at: http://localhost:${port}/api/docs`);
}
bootstrap();
