import { Module } from '@nestjs/common';
import { PeopleServiceController } from './people-service.controller';
import { PeopleServiceService } from './people-service.service';
import { ServicesModule } from './Services/services.module';
import { EntitiesModule } from './entities/entities.module';
import { ControllersModule } from './Controllers/controllers.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [// Configuración global
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
        inject: [ConfigService],
      }),
      // Módulos de entidades y servicios
      ServicesModule,
    ControllersModule,
    EntitiesModule,
  ],
  controllers: [PeopleServiceController],
  providers: [PeopleServiceService],
})
export class PeopleServiceModule { }

