import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Inject,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AuditoriaAccesoService } from '../../Services/Implementations/auditoria-acceso/auditoria-acceso.service';
import {
  IAuditoriaAccesoService,
  AuditoriaAccesoQuery,
} from '../../Services/Interfaces/auditoria-acceso/iauditoria-acceso.service';
import { CreateAuditoriaAccesoDto } from '../../dto/create-auditoria-acceso.dto';

@ApiTags('auditoria-acceso')
@Controller('auditoria-acceso')
export class AuditoriaAccesoController {
  constructor(
    @Inject('IAuditoriaAccesoService')
    private readonly auditoriaAccesoService: AuditoriaAccesoService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo registro de auditoría' })
  @ApiResponse({
    status: 201,
    description: 'Registro de auditoría creado exitosamente',
  })
  create(@Body() createAuditoriaAccesoDto: CreateAuditoriaAccesoDto) {
    return this.auditoriaAccesoService.create(createAuditoriaAccesoDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener registros de auditoría con filtros y paginación',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de registros obtenida exitosamente',
  })
  @ApiQuery({ name: 'page', required: false, description: 'Número de página' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Registros por página',
  })
  @ApiQuery({
    name: 'usuarioId',
    required: false,
    description: 'Filtrar por ID de usuario',
  })
  @ApiQuery({
    name: 'accion',
    required: false,
    description: 'Filtrar por acción',
  })
  @ApiQuery({
    name: 'recurso',
    required: false,
    description: 'Filtrar por recurso',
  })
  @ApiQuery({
    name: 'exitoso',
    required: false,
    description: 'Filtrar por estado exitoso',
  })
  @ApiQuery({
    name: 'ipAddress',
    required: false,
    description: 'Filtrar por dirección IP',
  })
  @ApiQuery({
    name: 'fechaDesde',
    required: false,
    description: 'Fecha desde (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'fechaHasta',
    required: false,
    description: 'Fecha hasta (YYYY-MM-DD)',
  })
  findAll(@Query() query: AuditoriaAccesoQuery) {
    return this.auditoriaAccesoService.findAll(query);
  }

  @Get('reporte-seguridad')
  @ApiOperation({ summary: 'Obtener reporte de seguridad con estadísticas' })
  @ApiResponse({
    status: 200,
    description: 'Reporte de seguridad generado exitosamente',
  })
  @ApiQuery({
    name: 'fechaDesde',
    required: false,
    description: 'Fecha desde (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'fechaHasta',
    required: false,
    description: 'Fecha hasta (YYYY-MM-DD)',
  })
  getSecurityReport(
    @Query('fechaDesde') fechaDesde?: string,
    @Query('fechaHasta') fechaHasta?: string,
  ) {
    const desde = fechaDesde ? new Date(fechaDesde) : undefined;
    const hasta = fechaHasta ? new Date(fechaHasta) : undefined;
    return this.auditoriaAccesoService.getSecurityReport(desde, hasta);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un registro de auditoría por ID' })
  @ApiResponse({ status: 200, description: 'Registro encontrado' })
  @ApiResponse({ status: 404, description: 'Registro no encontrado' })
  findOne(@Param('id') id: string) {
    return this.auditoriaAccesoService.findOne(id);
  }

  @Get('usuario/:usuarioId')
  @ApiOperation({
    summary: 'Obtener registros de auditoría de un usuario específico',
  })
  @ApiResponse({
    status: 200,
    description: 'Registros del usuario obtenidos exitosamente',
  })
  findByUserId(@Param('usuarioId') usuarioId: string) {
    return this.auditoriaAccesoService.findByUserId(usuarioId);
  }

  @Get('accion/:accion')
  @ApiOperation({ summary: 'Obtener registros por tipo de acción' })
  @ApiResponse({
    status: 200,
    description: 'Registros por acción obtenidos exitosamente',
  })
  findByAction(@Param('accion') accion: string) {
    return this.auditoriaAccesoService.findByAction(accion);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar un registro de auditoría (solo para administradores)',
  })
  @ApiResponse({ status: 200, description: 'Registro eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Registro no encontrado' })
  remove(@Param('id') id: string) {
    return this.auditoriaAccesoService.remove(id);
  }
}
