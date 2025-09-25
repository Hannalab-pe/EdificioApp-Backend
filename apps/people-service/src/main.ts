import { NestFactory } from '@nestjs/core';
import { PeopleServiceModule } from './people-service.module';

async function bootstrap() {
  const app = await NestFactory.create(PeopleServiceModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
