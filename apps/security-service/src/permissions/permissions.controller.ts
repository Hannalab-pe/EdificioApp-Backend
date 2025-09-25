import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PermissionResponseDto } from './dto/permission-response.dto';

@ApiTags('Permisos')
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo permiso' })
  @ApiResponse({
    status: 201,
    description: 'Permiso creado exitosamente',
    type: PermissionResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 409, description: 'Ya existe un permiso con esa combinación' })
  create(@Body() createPermissionDto: CreatePermissionDto): Promise<PermissionResponseDto> {
    return this.permissionsService.create(createPermissionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los permisos activos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de permisos obtenida exitosamente',
    type: [PermissionResponseDto],
  })
  findAll(): Promise<PermissionResponseDto[]> {
    return this.permissionsService.findAll();
  }

  @Get('modulo/:modulo')
  @ApiOperation({ summary: 'Obtener permisos por módulo' })
  @ApiParam({ name: 'modulo', description: 'Nombre del módulo' })
  @ApiResponse({
    status: 200,
    description: 'Lista de permisos del módulo obtenida exitosamente',
    type: [PermissionResponseDto],
  })
  findByModulo(@Param('modulo') modulo: string): Promise<PermissionResponseDto[]> {
    return this.permissionsService.findByModulo(modulo);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un permiso por ID' })
  @ApiParam({ name: 'id', description: 'ID del permiso' })
  @ApiResponse({
    status: 200,
    description: 'Permiso encontrado',
    type: PermissionResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Permiso no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<PermissionResponseDto> {
    return this.permissionsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un permiso' })
  @ApiParam({ name: 'id', description: 'ID del permiso' })
  @ApiResponse({
    status: 200,
    description: 'Permiso actualizado exitosamente',
    type: PermissionResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Permiso no encontrado' })
  @ApiResponse({ status: 409, description: 'Ya existe un permiso con esa combinación' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ): Promise<PermissionResponseDto> {
    return this.permissionsService.update(id, updatePermissionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un permiso (soft delete)' })
  @ApiParam({ name: 'id', description: 'ID del permiso' })
  @ApiResponse({
    status: 200,
    description: 'Permiso eliminado exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Permiso no encontrado' })
  @ApiResponse({ status: 400, description: 'No se puede eliminar el permiso porque está asignado a roles' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    return this.permissionsService.remove(id);
  }
}