import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SecurityServiceController } from './security-service.controller';
import { SecurityServiceService } from './security-service.service';
import { EntitiesModule } from './entities/entities.module';
import { ServicesModule } from './Services/services.module';
import { UsuarioController } from './controllers/usuario/usuario.controller';
import { RolController } from './controllers/rol/rol.controller';
import { DocumentoIdentidadController } from './controllers/documento-identidad/documento-identidad.controller';
import { PermisoController } from './controllers/permiso/permiso.controller';
import { RolPermisoController } from './controllers/rol-permiso/rol-permiso.controller';
import { SesionUsuarioController } from './controllers/sesion-usuario/sesion-usuario.controller';
import { AuditoriaAccesoController } from './controllers/auditoria-acceso/auditoria-acceso.controller';
import { ConfiguracionSeguridadController } from './ConfiguracionSeguridad/configuracion-seguridad.controller';

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
        entities: [__dirname + '/entities/*.{ts,js}'],
        synchronize: false, // Desactivar para evitar conflictos con esquemas existentes
        logging: configService.get('NODE_ENV') === 'development',
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    // Módulos de entidades y servicios
    EntitiesModule,
    ServicesModule,
  ],
  controllers: [
    SecurityServiceController,
    UsuarioController,
    RolController,
    DocumentoIdentidadController,
    PermisoController,
    RolPermisoController,
    SesionUsuarioController,
    AuditoriaAccesoController,
    ConfiguracionSeguridadController,
  ],
  providers: [SecurityServiceService],
})
export class SecurityServiceModule {}
