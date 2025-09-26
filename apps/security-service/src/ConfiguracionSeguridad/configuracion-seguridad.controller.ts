import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ConfiguracionSeguridadService } from './configuracion-seguridad.service';
import { CreateConfiguracionSeguridadDto } from './Dtos/CreateConfiguracionSeguridadDto';
import { UpdateConfiguracionSeguridadDto } from './Dtos/UpdateConfiguracionSeguridadDto';

@ApiTags('configuracion-seguridad')
@Controller('configuracion-seguridad')
export class ConfiguracionSeguridadController {
  constructor(
    private readonly configuracionSeguridadService: ConfiguracionSeguridadService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear nueva configuración de seguridad' })
  @ApiResponse({
    status: 201,
    description: 'Configuración creada exitosamente',
  })
  create(
    @Body() createConfiguracionSeguridadDto: CreateConfiguracionSeguridadDto,
  ) {
    return this.configuracionSeguridadService.create(
      createConfiguracionSeguridadDto,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las configuraciones de seguridad' })
  @ApiResponse({
    status: 200,
    description: 'Lista de configuraciones obtenida exitosamente',
  })
  findAll() {
    return this.configuracionSeguridadService.findAll();
  }

  @Get('activas')
  @ApiOperation({ summary: 'Obtener configuraciones activas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de configuraciones activas obtenida exitosamente',
  })
  getConfiguracionesActivas() {
    return this.configuracionSeguridadService.getConfiguracionesActivas();
  }

  @Get('por-estado')
  @ApiOperation({ summary: 'Obtener configuraciones por estado' })
  @ApiQuery({
    name: 'activa',
    type: Boolean,
    description: 'Estado de la configuración',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de configuraciones por estado obtenida exitosamente',
  })
  findByEstado(@Query('activa') activa: boolean) {
    return this.configuracionSeguridadService.findByEstado(activa);
  }

  @Get('tipo/:tipo')
  @ApiOperation({ summary: 'Obtener configuración por tipo' })
  @ApiParam({ name: 'tipo', description: 'Tipo de configuración' })
  @ApiResponse({
    status: 200,
    description: 'Configuración obtenida exitosamente',
  })
  findByTipo(@Param('tipo') tipo: string) {
    return this.configuracionSeguridadService.findByTipo(tipo);
  }

  @Get('por-defecto/:tipo')
  @ApiOperation({ summary: 'Obtener configuración por defecto por tipo' })
  @ApiParam({ name: 'tipo', description: 'Tipo de configuración' })
  @ApiResponse({
    status: 200,
    description: 'Configuración por defecto obtenida exitosamente',
  })
  getConfiguracionPorDefecto(@Param('tipo') tipo: string) {
    return this.configuracionSeguridadService.getConfiguracionPorDefecto(tipo);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener configuración por ID' })
  @ApiParam({ name: 'id', description: 'ID de la configuración' })
  @ApiResponse({
    status: 200,
    description: 'Configuración obtenida exitosamente',
  })
  findOne(@Param('id') id: string) {
    return this.configuracionSeguridadService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar configuración de seguridad' })
  @ApiParam({ name: 'id', description: 'ID de la configuración' })
  @ApiResponse({
    status: 200,
    description: 'Configuración actualizada exitosamente',
  })
  update(
    @Param('id') id: string,
    @Body() updateConfiguracionSeguridadDto: UpdateConfiguracionSeguridadDto,
  ) {
    return this.configuracionSeguridadService.update(
      +id,
      updateConfiguracionSeguridadDto,
    );
  }

  @Patch('valor/:tipo')
  @ApiOperation({ summary: 'Actualizar valor de configuración por tipo' })
  @ApiParam({ name: 'tipo', description: 'Tipo de configuración' })
  @ApiResponse({
    status: 200,
    description: 'Valor de configuración actualizado exitosamente',
  })
  updateValorByTipo(
    @Param('tipo') tipo: string,
    @Body() body: { valor: string },
  ) {
    return this.configuracionSeguridadService.updateValorByTipo(
      tipo,
      body.valor,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar configuración de seguridad' })
  @ApiParam({ name: 'id', description: 'ID de la configuración' })
  @ApiResponse({
    status: 200,
    description: 'Configuración eliminada exitosamente',
  })
  remove(@Param('id') id: string) {
    return this.configuracionSeguridadService.remove(+id);
  }
}
