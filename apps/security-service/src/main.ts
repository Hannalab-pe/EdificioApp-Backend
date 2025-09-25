import { NestFactory } from '@nestjs/core';
import { SecurityServiceModule } from './security-service.module';

async function bootstrap() {
  const app = await NestFactory.create(SecurityServiceModule);

  const port = process.env.AUTH_SERVICE_PORT || 3001;
  await app.listen(port);

  console.log(`🚀 Security Service running on: http://localhost:${port}`);
}
bootstrap();
