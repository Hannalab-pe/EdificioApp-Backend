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
import { UsuarioService } from '../../Services/Implementations/usuario/usuario.service';
import { UsuarioQuery } from '../../Services/Interfaces/usuario/iusuario.service';
import { CreateUsuarioDto } from '../../dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../../dto/update-usuario.dto';

@ApiTags('usuarios')
@Controller('usuarios')
export class UsuarioController {
  constructor(
    @Inject('IUsuarioService')
    private readonly usuarioService: UsuarioService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente' })
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuarioService.create(createUsuarioDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios obtenida exitosamente' })
  findAll(@Query() query: UsuarioQuery) {
    return this.usuarioService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener usuario por ID' })
  @ApiResponse({ status: 200, description: 'Usuario obtenido exitosamente' })
  findOne(@Param('id') id: string) {
    return this.usuarioService.findOne(id);
  }

  @Get('email/:email')
  @ApiOperation({ summary: 'Obtener usuario por email' })
  @ApiResponse({ status: 200, description: 'Usuario obtenido exitosamente' })
  findByEmail(@Param('email') email: string) {
    return this.usuarioService.findByEmail(email);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar usuario' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado exitosamente' })
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuarioService.update(id, updateUsuarioDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar usuario' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado exitosamente' })
  remove(@Param('id') id: string) {
    return this.usuarioService.remove(id);
  }

  @Patch(':id/soft-delete')
  @ApiOperation({ summary: 'Eliminar usuario lógicamente' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado lógicamente exitosamente' })
  softDelete(@Param('id') id: string) {
    return this.usuarioService.softDelete(id);
  }

  @Patch(':id/last-access')
  @ApiOperation({ summary: 'Actualizar último acceso del usuario' })
  @ApiResponse({ status: 200, description: 'Último acceso actualizado exitosamente' })
  updateLastAccess(@Param('id') id: string) {
    return this.usuarioService.updateLastAccess(id);
  }

  @Patch(':id/failed-attempts/increment')
  @ApiOperation({ summary: 'Incrementar intentos fallidos' })
  @ApiResponse({ status: 200, description: 'Intentos fallidos incrementados exitosamente' })
  incrementFailedAttempts(@Param('id') id: string) {
    return this.usuarioService.incrementFailedAttempts(id);
  }

  @Patch(':id/failed-attempts/reset')
  @ApiOperation({ summary: 'Resetear intentos fallidos' })
  @ApiResponse({ status: 200, description: 'Intentos fallidos reseteados exitosamente' })
  resetFailedAttempts(@Param('id') id: string) {
    return this.usuarioService.resetFailedAttempts(id);
  }

  @Patch(':id/block')
  @ApiOperation({ summary: 'Bloquear usuario hasta una fecha determinada' })
  @ApiResponse({ status: 200, description: 'Usuario bloqueado exitosamente' })
  blockUser(@Param('id') id: string, @Body() body: { until: string }) {
    return this.usuarioService.blockUser(id, new Date(body.until));
  }
}