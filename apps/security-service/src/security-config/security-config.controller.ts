import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { SecurityConfigService } from './security-config.service';
import { CreateSecurityConfigDto } from './dto/create-security-config.dto';
import { UpdateSecurityConfigDto } from './dto/update-security-config.dto';
import { SecurityConfigResponseDto } from './dto/security-config-response.dto';

@ApiTags('Configuraciones de Seguridad')
@Controller('security-config')
export class SecurityConfigController {
  constructor(private readonly securityConfigService: SecurityConfigService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva configuración de seguridad' })
  @ApiResponse({
    status: 201,
    description: 'Configuración creada exitosamente',
    type: SecurityConfigResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 409, description: 'Ya existe una configuración con esa clave' })
  create(@Body() createConfigDto: CreateSecurityConfigDto): Promise<SecurityConfigResponseDto> {
    return this.securityConfigService.create(createConfigDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las configuraciones de seguridad activas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de configuraciones obtenida exitosamente',
    type: [SecurityConfigResponseDto],
  })
  findAll(): Promise<SecurityConfigResponseDto[]> {
    return this.securityConfigService.findAll();
  }

  @Get('settings')
  @ApiOperation({ summary: 'Obtener todas las configuraciones como un objeto clave-valor' })
  @ApiResponse({
    status: 200,
    description: 'Configuraciones obtenidas exitosamente',
    schema: {
      type: 'object',
      additionalProperties: { type: 'string' },
    },
  })
  getSecuritySettings() {
    return this.securityConfigService.getSecuritySettings();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una configuración por ID' })
  @ApiParam({ name: 'id', description: 'ID de la configuración' })
  @ApiResponse({
    status: 200,
    description: 'Configuración encontrada',
    type: SecurityConfigResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Configuración no encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<SecurityConfigResponseDto> {
    return this.securityConfigService.findOne(id);
  }

  @Get('key/:clave')
  @ApiOperation({ summary: 'Obtener una configuración por clave' })
  @ApiParam({ name: 'clave', description: 'Clave de la configuración' })
  @ApiResponse({
    status: 200,
    description: 'Configuración encontrada',
    type: SecurityConfigResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Configuración no encontrada' })
  findByKey(@Param('clave') clave: string): Promise<SecurityConfigResponseDto> {
    return this.securityConfigService.findByKey(clave);
  }

  @Get('value/:clave')
  @ApiOperation({ summary: 'Obtener el valor de una configuración por clave' })
  @ApiParam({ name: 'clave', description: 'Clave de la configuración' })
  @ApiResponse({
    status: 200,
    description: 'Valor obtenido exitosamente',
    schema: { type: 'string', nullable: true },
  })
  getConfigValue(@Param('clave') clave: string): Promise<string | null> {
    return this.securityConfigService.getConfigValue(clave);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una configuración' })
  @ApiParam({ name: 'id', description: 'ID de la configuración' })
  @ApiResponse({
    status: 200,
    description: 'Configuración actualizada exitosamente',
    type: SecurityConfigResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Configuración no encontrada' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateConfigDto: UpdateSecurityConfigDto,
  ): Promise<SecurityConfigResponseDto> {
    return this.securityConfigService.update(id, updateConfigDto);
  }

  @Patch('key/:clave')
  @ApiOperation({ summary: 'Actualizar una configuración por clave' })
  @ApiParam({ name: 'clave', description: 'Clave de la configuración' })
  @ApiResponse({
    status: 200,
    description: 'Configuración actualizada exitosamente',
    type: SecurityConfigResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Configuración no encontrada' })
  updateByKey(
    @Param('clave') clave: string,
    @Body() updateConfigDto: UpdateSecurityConfigDto,
  ): Promise<SecurityConfigResponseDto> {
    return this.securityConfigService.updateByKey(clave, updateConfigDto);
  }

  @Post('set/:clave')
  @ApiOperation({ summary: 'Establecer o actualizar el valor de una configuración' })
  @ApiParam({ name: 'clave', description: 'Clave de la configuración' })
  @ApiResponse({
    status: 201,
    description: 'Configuración establecida exitosamente',
    type: SecurityConfigResponseDto,
  })
  setConfigValue(
    @Param('clave') clave: string,
    @Body() body: { valor: string; descripcion?: string },
  ): Promise<SecurityConfigResponseDto> {
    return this.securityConfigService.setConfigValue(clave, body.valor, body.descripcion);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una configuración (soft delete)' })
  @ApiParam({ name: 'id', description: 'ID de la configuración' })
  @ApiResponse({
    status: 200,
    description: 'Configuración eliminada exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Configuración no encontrada' })
  @ApiResponse({ status: 400, description: 'No se puede eliminar configuraciones críticas' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    return this.securityConfigService.remove(id);
  }
}