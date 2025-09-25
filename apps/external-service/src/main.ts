import { NestFactory } from '@nestjs/core';
import { ExternalServiceModule } from './external-service.module';

async function bootstrap() {
  const app = await NestFactory.create(ExternalServiceModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
