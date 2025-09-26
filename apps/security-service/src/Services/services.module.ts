// services/services.module.ts
import { Module } from '@nestjs/common';
import { EntitiesModule } from '../entities/entities.module';
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
})
export class ServicesModule {}
