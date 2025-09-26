import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Inject,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RolPermisoService } from '../../Services/Implementations/rol-permiso/rol-permiso.service';
import {
  IRolPermisoService,
  RolPermisoQuery,
} from '../../Services/Interfaces/rol-permiso/irol-permiso.service';
import { CreateRolPermisoDto } from '../../dto/create-rol-permiso.dto';
import { UpdateRolPermisoDto } from '../../dto/update-rol-permiso.dto';

@ApiTags('rol-permisos')
@Controller('rol-permisos')
export class RolPermisoController {
  constructor(
    @Inject('IRolPermisoService')
    private readonly rolPermisoService: RolPermisoService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva relación rol-permiso' })
  @ApiResponse({
    status: 201,
    description: 'Relación rol-permiso creada exitosamente',
  })
  @ApiResponse({ status: 409, description: 'La relación ya existe' })
  create(@Body() createRolPermisoDto: CreateRolPermisoDto) {
    return this.rolPermisoService.create(createRolPermisoDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener lista de relaciones rol-permiso con filtros y paginación',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de relaciones obtenida exitosamente',
  })
  findAll(@Query() query: RolPermisoQuery) {
    return this.rolPermisoService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una relación rol-permiso por ID' })
  @ApiResponse({ status: 200, description: 'Relación encontrada' })
  @ApiResponse({ status: 404, description: 'Relación no encontrada' })
  findOne(@Param('id') id: string) {
    return this.rolPermisoService.findOne(id);
  }

  @Get('rol/:rolId')
  @ApiOperation({ summary: 'Obtener todos los permisos de un rol' })
  @ApiResponse({
    status: 200,
    description: 'Permisos del rol obtenidos exitosamente',
  })
  findByRol(@Param('rolId') rolId: string) {
    return this.rolPermisoService.findByRolId(rolId);
  }

  @Get('permiso/:permisoId')
  @ApiOperation({ summary: 'Obtener todos los roles que tienen un permiso' })
  @ApiResponse({
    status: 200,
    description: 'Roles con el permiso obtenidos exitosamente',
  })
  findByPermiso(@Param('permisoId') permisoId: string) {
    return this.rolPermisoService.findByPermisoId(permisoId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una relación rol-permiso' })
  @ApiResponse({
    status: 200,
    description: 'Relación actualizada exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Relación no encontrada' })
  update(
    @Param('id') id: string,
    @Body() updateRolPermisoDto: UpdateRolPermisoDto,
  ) {
    return this.rolPermisoService.update(id, updateRolPermisoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una relación rol-permiso por ID' })
  @ApiResponse({ status: 200, description: 'Relación eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Relación no encontrada' })
  remove(@Param('id') id: string) {
    return this.rolPermisoService.remove(id);
  }

  @Delete('rol/:rolId/permiso/:permisoId')
  @ApiOperation({ summary: 'Eliminar relación específica entre rol y permiso' })
  @ApiResponse({ status: 200, description: 'Relación eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Relación no encontrada' })
  removeByRolAndPermiso(
    @Param('rolId') rolId: string,
    @Param('permisoId') permisoId: string,
  ) {
    return this.rolPermisoService.removeByRolAndPermiso(rolId, permisoId);
  }
}
