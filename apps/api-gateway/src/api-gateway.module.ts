import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    // Configuración global
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Clientes de microservicios
    ClientsModule.register([
      {
        name: 'SECURITY_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: 'security_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
      {
        name: 'PEOPLE_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: 'people_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
      {
        name: 'PROPERTY_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: 'property_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
      // Agregar más servicios según necesites...
    ]),

    // Módulos funcionales
    HealthModule,
  ],
  controllers: [ApiGatewayController],
  providers: [ApiGatewayService],
})
export class ApiGatewayModule { }