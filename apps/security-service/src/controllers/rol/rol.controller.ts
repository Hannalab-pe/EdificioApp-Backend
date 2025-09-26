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
import { RolService } from '../../Services/Implementations/rol/rol.service';
import { RolQuery } from '../../Services/Interfaces/rol/irol.service';
import {
  CreateRolDto,
  UpdateRolDto,
  RolResponseDto,
  RolListResponseDto,
} from '../../dto';
import { NivelAcceso } from '../../entities/Rol';

@ApiTags('roles')
@Controller('roles')
export class RolController {
  constructor(
    @Inject('IRolService')
    private readonly rolService: RolService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear nuevo rol' })
  @ApiResponse({
    status: 201,
    description: 'Rol creado exitosamente.',
    type: RolResponseDto,
  })
  @ApiResponse({ status: 409, description: 'Ya existe un rol con ese nombre.' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos.' })
  create(@Body() createRolDto: CreateRolDto): Promise<RolResponseDto> {
    return this.rolService.create(createRolDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar roles con paginación y filtros' })
  @ApiResponse({
    status: 200,
    description: 'Lista de roles obtenida exitosamente.',
    type: RolListResponseDto,
  })
  findAll(@Query() query: RolQuery): Promise<RolListResponseDto> {
    return this.rolService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener rol por ID' })
  @ApiResponse({
    status: 200,
    description: 'Rol encontrado exitosamente.',
    type: RolResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Rol no encontrado.' })
  findOne(@Param('id') id: string): Promise<RolResponseDto> {
    return this.rolService.findOne(id);
  }

  @Get('name/:nombre')
  @ApiOperation({ summary: 'Obtener rol por nombre' })
  @ApiResponse({
    status: 200,
    description: 'Rol encontrado exitosamente.',
    type: RolResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Rol no encontrado.' })
  findByName(@Param('nombre') nombre: string): Promise<RolResponseDto> {
    return this.rolService.findByName(nombre);
  }

  @Get('nivel-acceso/:nivelAcceso')
  @ApiOperation({ summary: 'Obtener roles por nivel de acceso' })
  @ApiResponse({
    status: 200,
    description: 'Roles encontrados exitosamente.',
    type: [RolResponseDto],
  })
  findByNivelAcceso(
    @Param('nivelAcceso') nivelAcceso: NivelAcceso,
  ): Promise<RolResponseDto[]> {
    return this.rolService.findByNivelAcceso(nivelAcceso);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar rol' })
  @ApiResponse({
    status: 200,
    description: 'Rol actualizado exitosamente.',
    type: RolResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Rol no encontrado.' })
  @ApiResponse({ status: 409, description: 'Ya existe un rol con ese nombre.' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos.' })
  update(
    @Param('id') id: string,
    @Body() updateRolDto: UpdateRolDto,
  ): Promise<RolResponseDto> {
    return this.rolService.update(id, updateRolDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar rol permanentemente' })
  @ApiResponse({ status: 200, description: 'Rol eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Rol no encontrado.' })
  remove(@Param('id') id: string): Promise<void> {
    return this.rolService.remove(id);
  }

  @Patch(':id/soft-delete')
  @ApiOperation({ summary: 'Desactivar rol (eliminación suave)' })
  @ApiResponse({ status: 200, description: 'Rol desactivado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Rol no encontrado.' })
  softDelete(@Param('id') id: string): Promise<void> {
    return this.rolService.softDelete(id);
  }
}
