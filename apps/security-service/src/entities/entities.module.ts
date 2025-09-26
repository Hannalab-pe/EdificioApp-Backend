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
})
export class EntitiesModule {}
