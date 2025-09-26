// services/services.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EntitiesModule } from '../entities/entities.module';
// =========== IMPORTAR RABBITMQ PARA ACCESO EN SERVICIOS ===========
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import {
  AuditoriaAccesoService,
  ConfiguracionSeguridadService,
  DocumentoIdentidadService,
  PermisoService,
  RolService,
  RolPermisoService,
  SesionUsuarioService,
  UsuarioService,
} from './Implementations';

@Module({
  imports: [EntitiesModule],
  providers: [
    // Servicios del security-service usando string tokens para interfaces
    {
      provide: 'IAuditoriaAccesoService',
      useClass: AuditoriaAccesoService,
    },
    {
      provide: 'IConfiguracionSeguridadService',
      useClass: ConfiguracionSeguridadService,
    },
    {
      provide: 'IDocumentoIdentidadService',
      useClass: DocumentoIdentidadService,
    },
    {
      provide: 'IPermisoService',
      useClass: PermisoService,
    },
    {
      provide: 'IRolService',
      useClass: RolService,
    },
    {
      provide: 'IRolPermisoService',
      useClass: RolPermisoService,
    },
    {
      provide: 'ISesionUsuarioService',
      useClass: SesionUsuarioService,
    },
    {
      provide: 'IUsuarioService',
      useClass: UsuarioService,
    },

    // También exportar las clases directas para casos específicos
    AuditoriaAccesoService,
    ConfiguracionSeguridadService,
    DocumentoIdentidadService,
    PermisoService,
    RolService,
    RolPermisoService,
    SesionUsuarioService,
    UsuarioService,
<<<<<<< HEAD
  ],
  exports: [
    // String tokens para interfaces
    'IAuditoriaAccesoService',
    'IConfiguracionSeguridadService',
    'IDocumentoIdentidadService',
    'IPermisoService',
    'IRolService',
    'IRolPermisoService',
    'ISesionUsuarioService',
    'IUsuarioService',

    // Clases directas
    AuditoriaAccesoService,
    ConfiguracionSeguridadService,
    DocumentoIdentidadService,
    PermisoService,
    RolService,
    RolPermisoService,
    SesionUsuarioService,
    UsuarioService,
  ],
=======
} from './Implementations';
// =========== IMPORTAR HANDLERS DE EVENTOS ===========
import {
    TrabajadorCreationCompletedHandler,
    TrabajadorCreationFailedHandler
} from '../events/trabajador-response.handlers';

@Module({
    imports: [
        EntitiesModule,
        // =========== CONFIGURAR RABBITMQ EN SERVICES MODULE ===========
        // Configuración específica para que UsuarioService tenga acceso
        RabbitMQModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                exchanges: [
                    {
                        name: 'saga.trabajador',
                        type: 'topic',
                        options: { durable: true }
                    }
                ],
                uri: configService.get('RABBITMQ_URL') || 'amqp://localhost:5672',
                connectionInitOptions: { wait: false },
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [
        // Servicios del security-service usando string tokens para interfaces
        {
            provide: 'IAuditoriaAccesoService',
            useClass: AuditoriaAccesoService,
        },
        {
            provide: 'IConfiguracionSeguridadService',
            useClass: ConfiguracionSeguridadService,
        },
        {
            provide: 'IDocumentoIdentidadService',
            useClass: DocumentoIdentidadService,
        },
        {
            provide: 'IPermisoService',
            useClass: PermisoService,
        },
        {
            provide: 'IRolService',
            useClass: RolService,
        },
        {
            provide: 'IRolPermisoService',
            useClass: RolPermisoService,
        },
        {
            provide: 'ISesionUsuarioService',
            useClass: SesionUsuarioService,
        },
        {
            provide: 'IUsuarioService',
            useClass: UsuarioService,
        },

        // También exportar las clases directas para casos específicos
        AuditoriaAccesoService,
        ConfiguracionSeguridadService,
        DocumentoIdentidadService,
        PermisoService,
        RolService,
        RolPermisoService,
        SesionUsuarioService,
        UsuarioService,

        // =========== HANDLERS DE EVENTOS RABBITMQ ===========
        TrabajadorCreationCompletedHandler,
        TrabajadorCreationFailedHandler,
    ],
    exports: [
        // String tokens para interfaces
        'IAuditoriaAccesoService',
        'IConfiguracionSeguridadService',
        'IDocumentoIdentidadService',
        'IPermisoService',
        'IRolService',
        'IRolPermisoService',
        'ISesionUsuarioService',
        'IUsuarioService',

        // Clases directas
        AuditoriaAccesoService,
        ConfiguracionSeguridadService,
        DocumentoIdentidadService,
        PermisoService,
        RolService,
        RolPermisoService,
        SesionUsuarioService,
        UsuarioService,
    ],
>>>>>>> 872c80c6d7bf7361f9d25592c6a22381544844d2
})
export class ServicesModule {}
