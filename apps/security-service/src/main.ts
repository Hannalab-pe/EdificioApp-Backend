import { NestFactory } from '@nestjs/core';
import { SecurityServiceModule } from './security-service.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(SecurityServiceModule);

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Security Service API')
    .setDescription('API para gestión de autenticación, usuarios, roles y permisos')
    .setVersion('1.0')
    .addTag('usuarios', 'Gestión de usuarios del sistema')
    .addTag('roles', 'Gestión de roles y permisos')
    .addTag('documentos', 'Gestión de documentos de identidad')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.AUTH_SERVICE_PORT || 3001;
  await app.listen(port);

  console.log(`🚀 Security Service running on: http://localhost:${port}`);
  console.log(`📚 Swagger docs available at: http://localhost:${port}/api/docs`);
}
bootstrap();
