import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AuditService } from './audit.service';
import { AuditLogResponseDto } from './dto/audit-log-response.dto';
import { AuditLogFiltersDto } from './dto/audit-log-filters.dto';

@ApiTags('Auditoría')
@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener registros de auditoría con filtros y paginación' })
  @ApiQuery({ name: 'page', required: false, description: 'Número de página (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Registros por página (default: 50)' })
  @ApiResponse({
    status: 200,
    description: 'Lista de registros de auditoría obtenida exitosamente',
    schema: {
      type: 'object',
      properties: {
        data: { type: 'array', items: { $ref: '#/components/schemas/AuditLogResponseDto' } },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
        totalPages: { type: 'number' },
      },
    },
  })
  findAll(
    @Query() filters: AuditLogFiltersDto,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 50,
  ) {
    return this.auditService.findAll(filters, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un registro de auditoría por ID' })
  @ApiParam({ name: 'id', description: 'ID del registro de auditoría' })
  @ApiResponse({
    status: 200,
    description: 'Registro de auditoría encontrado',
    type: AuditLogResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Registro de auditoría no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<AuditLogResponseDto> {
    return this.auditService.findOne(id);
  }

  @Get('user/:usuarioId')
  @ApiOperation({ summary: 'Obtener registros de auditoría por usuario' })
  @ApiParam({ name: 'usuarioId', description: 'ID del usuario' })
  @ApiQuery({ name: 'page', required: false, description: 'Número de página (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Registros por página (default: 50)' })
  @ApiResponse({
    status: 200,
    description: 'Registros de auditoría del usuario obtenidos exitosamente',
    schema: {
      type: 'object',
      properties: {
        data: { type: 'array', items: { $ref: '#/components/schemas/AuditLogResponseDto' } },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
        totalPages: { type: 'number' },
      },
    },
  })
  findByUser(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 50,
  ) {
    return this.auditService.findByUser(usuarioId, page, limit);
  }

  @Get('action/:accion')
  @ApiOperation({ summary: 'Obtener registros de auditoría por acción' })
  @ApiParam({ name: 'accion', description: 'Nombre de la acción' })
  @ApiQuery({ name: 'page', required: false, description: 'Número de página (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Registros por página (default: 50)' })
  @ApiResponse({
    status: 200,
    description: 'Registros de auditoría de la acción obtenidos exitosamente',
    schema: {
      type: 'object',
      properties: {
        data: { type: 'array', items: { $ref: '#/components/schemas/AuditLogResponseDto' } },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
        totalPages: { type: 'number' },
      },
    },
  })
  findByAction(
    @Param('accion') accion: string,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 50,
  ) {
    return this.auditService.findByAction(accion, page, limit);
  }

  @Get('stats/summary')
  @ApiOperation({ summary: 'Obtener estadísticas de auditoría' })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas de auditoría obtenidas exitosamente',
    schema: {
      type: 'object',
      properties: {
        totalLogs: { type: 'number' },
        successfulActions: { type: 'number' },
        failedActions: { type: 'number' },
        uniqueUsers: { type: 'number' },
        recentActivity: { type: 'array', items: { $ref: '#/components/schemas/AuditLogResponseDto' } },
      },
    },
  })
  getAuditStats() {
    return this.auditService.getAuditStats();
  }
}