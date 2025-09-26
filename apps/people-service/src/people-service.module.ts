import { Module } from '@nestjs/common';
import { PeopleServiceController } from './people-service.controller';
import { PeopleServiceService } from './people-service.service';
import { ServicesModule } from './Services/services.module';
import { EntitiesModule } from './entities/entities.module';
import { ControllersModule } from './Controllers/controllers.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
// =========== IMPORTACIÓN DE RABBITMQ ===========
// Importamos RabbitMQ para recibir eventos del Security Service
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
// =========== IMPORTAR HANDLER DE EVENTOS ===========
// Handler para procesar eventos de creación de trabajador
import { TrabajadorSagaHandler } from './events/trabajador-saga.handler';

@Module({
  imports: [
    // Configuración global
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // Configuración de base de datos
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        logging: configService.get('NODE_ENV') === 'development',
        autoLoadEntities: true,
      }),
<<<<<<< HEAD
      inject: [ConfigService],
    }),
    // Módulos de entidades y servicios
    ServicesModule,
=======
      // Configuración de base de datos
      TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_NAME'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          logging: configService.get('NODE_ENV') === 'development',
          autoLoadEntities: true,
        }),
        inject: [ConfigService],
      }),
      // =========== CONFIGURACIÓN DE RABBITMQ ===========
      // Configuramos RabbitMQ para RECIBIR eventos del Security Service
      RabbitMQModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          // =========== EXCHANGE COMPARTIDO ===========
          // Mismo exchange que usa Security Service para enviar eventos
          exchanges: [
            {
              name: 'saga.trabajador', // ← Mismo nombre que en Security Service
              type: 'topic',           // ← Permite patrones de routing
              options: { durable: true } // ← Sobrevive a reinicios del broker
            }
          ],
          // =========== QUEUES PARA RECIBIR MENSAJES ===========
          // Las colas se crearán automáticamente por los handlers
          // =========== BINDINGS: CONECTAR EXCHANGE CON QUEUES ===========
          // Define qué mensajes van a qué cola según el routing key
          bindings: [
            {
              exchange: 'saga.trabajador',         // ← Exchange origen
              routingKey: 'creation.requested',    // ← Patrón de routing
              queue: 'trabajador.creation.requests' // ← Cola destino
            }
          ],
          // =========== CONEXIÓN AL BROKER ===========
          uri: configService.get('RABBITMQ_URL') || 'amqp://localhost:5672',
          connectionInitOptions: { wait: false }, // ← No bloquea el arranque
        }),
        inject: [ConfigService],
      }),
      // Módulos de entidades y servicios
      ServicesModule,
>>>>>>> 872c80c6d7bf7361f9d25592c6a22381544844d2
    ControllersModule,
    EntitiesModule,
  ],
  controllers: [PeopleServiceController],
  providers: [
    PeopleServiceService,
    // =========== REGISTRAR HANDLER DE EVENTOS ===========
    // Este handler procesa eventos de creación de trabajador del Security Service
    TrabajadorSagaHandler,               // ← Escucha eventos 'creation.requested'
  ],
})
export class PeopleServiceModule {}
