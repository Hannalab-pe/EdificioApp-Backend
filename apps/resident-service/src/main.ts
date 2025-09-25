import { NestFactory } from '@nestjs/core';
import { ResidentServiceModule } from './resident-service.module';

async function bootstrap() {
  const app = await NestFactory.create(ResidentServiceModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
