import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditoriaAcceso } from './AuditoriaAcceso';
import { ConfiguracionSeguridad } from './configuracion-seguridad.entity';
import { DocumentoIdentidad } from './DocumentoIdentidad';
import { Permiso } from './Permiso';
import { Rol } from './Rol';
import { RolPermiso } from './RolPermiso';
import { SesionUsuario } from './SesionUsuario';
import { SolicitudTrabajador } from './SolicitudTrabajador';
import { Usuario } from './Usuario';

@Module({
<<<<<<< HEAD
  imports: [
    TypeOrmModule.forFeature([
      AuditoriaAcceso,
      ConfiguracionSeguridad,
      DocumentoIdentidad,
      Permiso,
      Rol,
      RolPermiso,
      SesionUsuario,
      Usuario,
    ]),
  ],
  exports: [
    TypeOrmModule,
    // Exportar también los repositorios específicos si es necesario
  ],
=======
    imports: [TypeOrmModule.forFeature([
        AuditoriaAcceso,
        ConfiguracionSeguridad,
        DocumentoIdentidad,
        Permiso,
        Rol,
        RolPermiso,
        SesionUsuario,
        SolicitudTrabajador,
        Usuario,
    ])],
    exports: [
        TypeOrmModule,
        // Exportar también los repositorios específicos si es necesario
    ],
>>>>>>> 872c80c6d7bf7361f9d25592c6a22381544844d2
})
export class EntitiesModule {}
