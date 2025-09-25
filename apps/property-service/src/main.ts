import { NestFactory } from '@nestjs/core';
import { PropertyServiceModule } from './property-service.module';

async function bootstrap() {
  const app = await NestFactory.create(PropertyServiceModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
