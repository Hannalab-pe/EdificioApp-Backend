import { NestFactory } from '@nestjs/core';
import { GovernanceServiceModule } from './governance-service.module';

async function bootstrap() {
  const app = await NestFactory.create(GovernanceServiceModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
