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
import { SesionUsuarioService } from '../../Services/Implementations/sesion-usuario/sesion-usuario.service';
import {
  ISesionUsuarioService,
  SesionUsuarioQuery,
} from '../../Services/Interfaces/sesion-usuario/isesion-usuario.service';
import { CreateSesionUsuarioDto } from '../../dto/create-sesion-usuario.dto';
import { UpdateSesionUsuarioDto } from '../../dto/update-sesion-usuario.dto';

@ApiTags('sesiones-usuario')
@Controller('sesiones-usuario')
export class SesionUsuarioController {
  constructor(
    @Inject('ISesionUsuarioService')
    private readonly sesionUsuarioService: SesionUsuarioService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva sesión de usuario' })
  @ApiResponse({ status: 201, description: 'Sesión creada exitosamente' })
  create(@Body() createSesionUsuarioDto: CreateSesionUsuarioDto) {
    return this.sesionUsuarioService.create(createSesionUsuarioDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener lista de sesiones con filtros y paginación',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de sesiones obtenida exitosamente',
  })
  findAll(@Query() query: SesionUsuarioQuery) {
    return this.sesionUsuarioService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una sesión por ID' })
  @ApiResponse({ status: 200, description: 'Sesión encontrada' })
  @ApiResponse({ status: 404, description: 'Sesión no encontrada' })
  findOne(@Param('id') id: string) {
    return this.sesionUsuarioService.findOne(id);
  }

  @Get('token/:tokenHash')
  @ApiOperation({ summary: 'Obtener sesión por token hash' })
  @ApiResponse({ status: 200, description: 'Sesión encontrada' })
  @ApiResponse({ status: 404, description: 'Sesión no encontrada o inactiva' })
  findByToken(@Param('tokenHash') tokenHash: string) {
    return this.sesionUsuarioService.findByToken(tokenHash);
  }

  @Get('usuario/:usuarioId/activas')
  @ApiOperation({ summary: 'Obtener sesiones activas de un usuario' })
  @ApiResponse({
    status: 200,
    description: 'Sesiones activas obtenidas exitosamente',
  })
  findActiveByUserId(@Param('usuarioId') usuarioId: string) {
    return this.sesionUsuarioService.findActiveByUserId(usuarioId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una sesión' })
  @ApiResponse({ status: 200, description: 'Sesión actualizada exitosamente' })
  @ApiResponse({ status: 404, description: 'Sesión no encontrada' })
  update(
    @Param('id') id: string,
    @Body() updateSesionUsuarioDto: UpdateSesionUsuarioDto,
  ) {
    return this.sesionUsuarioService.update(id, updateSesionUsuarioDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una sesión permanentemente' })
  @ApiResponse({ status: 200, description: 'Sesión eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Sesión no encontrada' })
  remove(@Param('id') id: string) {
    return this.sesionUsuarioService.remove(id);
  }

  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Desactivar una sesión específica' })
  @ApiResponse({ status: 200, description: 'Sesión desactivada exitosamente' })
  @ApiResponse({ status: 404, description: 'Sesión no encontrada' })
  deactivateSession(@Param('id') id: string) {
    return this.sesionUsuarioService.deactivateSession(id);
  }

  @Patch('usuario/:usuarioId/deactivate-all')
  @ApiOperation({ summary: 'Desactivar todas las sesiones de un usuario' })
  @ApiResponse({
    status: 200,
    description: 'Todas las sesiones del usuario desactivadas exitosamente',
  })
  deactivateAllUserSessions(@Param('usuarioId') usuarioId: string) {
    return this.sesionUsuarioService.deactivateAllUserSessions(usuarioId);
  }

  @Post('clean-expired')
  @ApiOperation({ summary: 'Limpiar sesiones expiradas del sistema' })
  @ApiResponse({
    status: 200,
    description: 'Sesiones expiradas limpiadas exitosamente',
  })
  cleanExpiredSessions() {
    return this.sesionUsuarioService.cleanExpiredSessions();
  }
}
