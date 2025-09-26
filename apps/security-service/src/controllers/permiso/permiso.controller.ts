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
import { PermisoService } from '../../Services/Implementations/permiso/permiso.service';
import {
  IPermisoService,
  PermisoQuery,
} from '../../Services/Interfaces/permiso/ipermiso.service';
import { CreatePermisoDto } from '../../dto/create-permiso.dto';
import { UpdatePermisoDto } from '../../dto/update-permiso.dto';

@ApiTags('permisos')
@Controller('permisos')
export class PermisoController {
  constructor(
    @Inject('IPermisoService')
    private readonly permisoService: PermisoService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo permiso' })
  @ApiResponse({ status: 201, description: 'Permiso creado exitosamente' })
  create(@Body() createPermisoDto: CreatePermisoDto) {
    return this.permisoService.create(createPermisoDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener lista de permisos con filtros y paginación',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de permisos obtenida exitosamente',
  })
  findAll(@Query() query: PermisoQuery) {
    return this.permisoService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un permiso por ID' })
  @ApiResponse({ status: 200, description: 'Permiso encontrado' })
  @ApiResponse({ status: 404, description: 'Permiso no encontrado' })
  findOne(@Param('id') id: string) {
    return this.permisoService.findOne(id);
  }

  @Get('name/:nombre')
  @ApiOperation({ summary: 'Obtener un permiso por nombre' })
  @ApiResponse({ status: 200, description: 'Permiso encontrado' })
  @ApiResponse({ status: 404, description: 'Permiso no encontrado' })
  findByName(@Param('nombre') nombre: string) {
    return this.permisoService.findByName(nombre);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un permiso' })
  @ApiResponse({ status: 200, description: 'Permiso actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Permiso no encontrado' })
  update(@Param('id') id: string, @Body() updatePermisoDto: UpdatePermisoDto) {
    return this.permisoService.update(id, updatePermisoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un permiso permanentemente' })
  @ApiResponse({ status: 200, description: 'Permiso eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Permiso no encontrado' })
  remove(@Param('id') id: string) {
    return this.permisoService.remove(id);
  }

  @Patch(':id/soft-delete')
  @ApiOperation({ summary: 'Desactivar un permiso (eliminación suave)' })
  @ApiResponse({ status: 200, description: 'Permiso desactivado exitosamente' })
  @ApiResponse({ status: 404, description: 'Permiso no encontrado' })
  softDelete(@Param('id') id: string) {
    return this.permisoService.softDelete(id);
  }
}
