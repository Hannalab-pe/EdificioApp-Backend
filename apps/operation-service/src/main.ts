import { NestFactory } from '@nestjs/core';
import { OperationServiceModule } from './operation-service.module';

async function bootstrap() {
  const app = await NestFactory.create(OperationServiceModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
