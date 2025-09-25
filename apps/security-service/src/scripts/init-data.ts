import { NestFactory } from '@nestjs/core';
import { SecurityServiceModule } from '../security-service.module';
import { RolesService } from '../roles/roles.service';
import { PermissionsService } from '../permissions/permissions.service';
import { NivelAcceso } from '../entities/rol.entity';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SecurityServiceModule);

  const rolesService = app.get(RolesService);
  const permissionsService = app.get(PermissionsService);

  console.log('🚀 Iniciando inicialización de datos por defecto...');

  try {
    // Crear permisos básicos
    console.log('📝 Creando permisos básicos...');

    const permisosBasicos = [
      // Usuarios
      { modulo: 'usuarios', accion: 'crear', descripcion: 'Crear nuevos usuarios' },
      { modulo: 'usuarios', accion: 'leer', descripcion: 'Ver información de usuarios' },
      { modulo: 'usuarios', accion: 'actualizar', descripcion: 'Actualizar información de usuarios' },
      { modulo: 'usuarios', accion: 'eliminar', descripcion: 'Eliminar usuarios' },

      // Roles
      { modulo: 'roles', accion: 'crear', descripcion: 'Crear nuevos roles' },
      { modulo: 'roles', accion: 'leer', descripcion: 'Ver roles y permisos' },
      { modulo: 'roles', accion: 'actualizar', descripcion: 'Actualizar roles y permisos' },
      { modulo: 'roles', accion: 'eliminar', descripcion: 'Eliminar roles' },

      // Propiedades
      { modulo: 'propiedades', accion: 'crear', descripcion: 'Crear nuevas propiedades' },
      { modulo: 'propiedades', accion: 'leer', descripcion: 'Ver información de propiedades' },
      { modulo: 'propiedades', accion: 'actualizar', descripcion: 'Actualizar propiedades' },
      { modulo: 'propiedades', accion: 'eliminar', descripcion: 'Eliminar propiedades' },

      // Pagos
      { modulo: 'pagos', accion: 'crear', descripcion: 'Registrar nuevos pagos' },
      { modulo: 'pagos', accion: 'leer', descripcion: 'Ver historial de pagos' },
      { modulo: 'pagos', accion: 'actualizar', descripcion: 'Actualizar pagos' },
      { modulo: 'pagos', accion: 'eliminar', descripcion: 'Eliminar pagos' },

      // Reportes
      { modulo: 'reportes', accion: 'leer', descripcion: 'Ver reportes del sistema' },
      { modulo: 'reportes', accion: 'exportar', descripcion: 'Exportar reportes' },

      // Configuración
      { modulo: 'configuracion', accion: 'leer', descripcion: 'Ver configuraciones del sistema' },
      { modulo: 'configuracion', accion: 'actualizar', descripcion: 'Actualizar configuraciones' },
    ];

    const permisosIds: number[] = [];

    for (const permisoData of permisosBasicos) {
      try {
        const permiso = await permissionsService.create(permisoData);
        permisosIds.push(permiso.id);
        console.log(`✅ Permiso creado: ${permisoData.modulo}:${permisoData.accion}`);
      } catch (error) {
        // Si el permiso ya existe, buscarlo y agregarlo
        try {
          const existingPermisos = await permissionsService.findAll();
          const existing = existingPermisos.find(p =>
            p.modulo === permisoData.modulo && p.accion === permisoData.accion
          );
          if (existing) {
            permisosIds.push(existing.id);
            console.log(`ℹ️  Permiso ya existe: ${permisoData.modulo}:${permisoData.accion}`);
          }
        } catch (findError) {
          console.error(`❌ Error con permiso ${permisoData.modulo}:${permisoData.accion}:`, error.message);
        }
      }
    }

    // Crear roles por defecto
    console.log('👥 Creando roles por defecto...');

    const rolesData = [
      {
        nombre: 'ADMIN',
        descripcion: 'Administrador del sistema con acceso completo',
        nivelAcceso: NivelAcceso.ADMIN,
        permisosIds: permisosIds, // Todos los permisos
      },
      {
        nombre: 'CONDOMINIO',
        descripcion: 'Administrador del condominio',
        nivelAcceso: NivelAcceso.CONDOMINIO,
        permisosIds: permisosIds.filter(id => {
          // Filtrar permisos que no sean de configuración del sistema
          const permiso = permisosBasicos[permisosIds.indexOf(id)];
          return permiso?.modulo !== 'configuracion' || permiso?.accion === 'leer';
        }),
      },
      {
        nombre: 'RESIDENTE',
        descripcion: 'Residente del condominio',
        nivelAcceso: NivelAcceso.RESIDENTE,
        permisosIds: permisosIds.filter(id => {
          const permiso = permisosBasicos[permisosIds.indexOf(id)];
          // Solo permisos de lectura para residentes
          return permiso?.accion === 'leer' && !['configuracion', 'roles', 'usuarios'].includes(permiso.modulo);
        }),
      },
      {
        nombre: 'TRABAJADOR',
        descripcion: 'Trabajador del condominio (portero, jardinero, etc.)',
        nivelAcceso: NivelAcceso.TRABAJADOR,
        permisosIds: permisosIds.filter(id => {
          const permiso = permisosBasicos[permisosIds.indexOf(id)];
          // Permisos limitados para trabajadores
          return ['propiedades', 'pagos', 'reportes'].includes(permiso?.modulo) && permiso?.accion === 'leer';
        }),
      },
    ];

    for (const rolData of rolesData) {
      try {
        const rol = await rolesService.create(rolData);
        console.log(`✅ Rol creado: ${rol.nombre} (${rol.nivelAcceso})`);
      } catch (error) {
        if (error.message.includes('Ya existe un rol con ese nombre')) {
          console.log(`ℹ️  Rol ya existe: ${rolData.nombre}`);
        } else {
          console.error(`❌ Error creando rol ${rolData.nombre}:`, error.message);
        }
      }
    }

    console.log('🎉 Inicialización completada exitosamente!');
    console.log('');
    console.log('📋 Resumen:');
    console.log(`   - Permisos creados: ${permisosBasicos.length}`);
    console.log(`   - Roles creados: ${rolesData.length}`);
    console.log('');
    console.log('🔐 Ahora puedes registrar usuarios. El rol por defecto es "RESIDENTE".');

  } catch (error) {
    console.error('❌ Error durante la inicialización:', error);
  } finally {
    await app.close();
  }
}

bootstrap();