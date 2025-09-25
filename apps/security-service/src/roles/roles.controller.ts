import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { PermissionsService } from '../permissions/permissions.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleWithPermissionsResponseDto } from './dto/role-with-permissions-response.dto';
import { NivelAcceso } from '../entities/rol.entity';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(
    private readonly rolesService: RolesService,
    private readonly permissionsService: PermissionsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo rol' })
  @ApiResponse({
    status: 201,
    description: 'Rol creado exitosamente',
    type: RoleWithPermissionsResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 409, description: 'Ya existe un rol con ese nombre' })
  create(@Body() createRoleDto: CreateRoleDto): Promise<RoleWithPermissionsResponseDto> {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los roles activos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de roles obtenida exitosamente',
    type: [RoleWithPermissionsResponseDto],
  })
  findAll(): Promise<RoleWithPermissionsResponseDto[]> {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un rol por ID' })
  @ApiParam({ name: 'id', description: 'ID del rol' })
  @ApiResponse({
    status: 200,
    description: 'Rol encontrado',
    type: RoleWithPermissionsResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Rol no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<RoleWithPermissionsResponseDto> {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un rol' })
  @ApiParam({ name: 'id', description: 'ID del rol' })
  @ApiResponse({
    status: 200,
    description: 'Rol actualizado exitosamente',
    type: RoleWithPermissionsResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Rol no encontrado' })
  @ApiResponse({ status: 409, description: 'Ya existe un rol con ese nombre' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<RoleWithPermissionsResponseDto> {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un rol (soft delete)' })
  @ApiParam({ name: 'id', description: 'ID del rol' })
  @ApiResponse({
    status: 200,
    description: 'Rol eliminado exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Rol no encontrado' })
  @ApiResponse({ status: 400, description: 'No se puede eliminar el rol porque tiene usuarios asignados' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    return this.rolesService.remove(id);
  }

  @Post('init-default-data')
  @ApiOperation({ summary: 'Inicializar roles y permisos por defecto (solo para desarrollo)' })
  @ApiResponse({
    status: 200,
    description: 'Datos inicializados exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        rolesCreated: { type: 'number' },
        permissionsCreated: { type: 'number' },
      },
    },
  })
  async initDefaultData() {
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
      let permissionsCreated = 0;

      for (const permisoData of permisosBasicos) {
        try {
          const permiso = await this.permissionsService.create(permisoData);
          permisosIds.push(permiso.id);
          permissionsCreated++;
          console.log(`✅ Permiso creado: ${permisoData.modulo}:${permisoData.accion}`);
        } catch (error) {
          // Si el permiso ya existe, buscarlo y agregarlo
          try {
            const existingPermisos = await this.permissionsService.findAll();
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

      let rolesCreated = 0;

      for (const rolData of rolesData) {
        try {
          const rol = await this.rolesService.create(rolData);
          rolesCreated++;
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

      return {
        message: 'Datos inicializados exitosamente',
        rolesCreated,
        permissionsCreated,
      };

    } catch (error) {
      console.error('❌ Error durante la inicialización:', error);
      throw error;
    }
  }
}