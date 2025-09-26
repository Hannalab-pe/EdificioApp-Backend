import {
<<<<<<< HEAD
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
=======
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  BaseResponseDto,
  BlockUsuarioDto,
  CreateUsuarioDto,
  CreateUsuarioTrabajadorDto,
  UpdateUsuarioDto,
  UsuarioListResponseDto,
  UsuarioResponseDto,
  UsuarioTrabajadorCompositeDto,
} from '../../dto';
import { IUsuarioService, UsuarioQuery } from '../../Services/Interfaces/usuario/iusuario.service';
>>>>>>> 872c80c6d7bf7361f9d25592c6a22381544844d2

@ApiTags('usuarios')
@ApiExtraModels(
  BaseResponseDto,
  UsuarioResponseDto,
  UsuarioListResponseDto,
  UsuarioTrabajadorCompositeDto,
)
@Controller('usuarios')
export class UsuarioController {
  constructor(
    @Inject('IUsuarioService')
<<<<<<< HEAD
    private readonly usuarioService: UsuarioService,
  ) {}

  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuarioService.create(createUsuarioDto);
  }

  @Get()
  findAll(@Query() query: UsuarioQuery) {
    return this.usuarioService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuarioService.findOne(id);
  }

  @Get('email/:email')
  findByEmail(@Param('email') email: string) {
    return this.usuarioService.findByEmail(email);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuarioService.update(id, updateUsuarioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuarioService.remove(id);
  }

  @Patch(':id/soft-delete')
  softDelete(@Param('id') id: string) {
    return this.usuarioService.softDelete(id);
  }

  @Patch(':id/last-access')
  updateLastAccess(@Param('id') id: string) {
    return this.usuarioService.updateLastAccess(id);
  }

  @Patch(':id/failed-attempts/increment')
  incrementFailedAttempts(@Param('id') id: string) {
    return this.usuarioService.incrementFailedAttempts(id);
  }

  @Patch(':id/failed-attempts/reset')
  resetFailedAttempts(@Param('id') id: string) {
    return this.usuarioService.resetFailedAttempts(id);
  }

  @Patch(':id/block')
  blockUser(@Param('id') id: string, @Body() body: { until: string }) {
=======
    private readonly usuarioService: IUsuarioService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Usuario creado exitosamente',
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResponseDto) },
        {
          properties: {
            data: { $ref: getSchemaPath(UsuarioResponseDto) },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos invalidos o email/documento duplicado',
    schema: { $ref: getSchemaPath(BaseResponseDto) },
  })
  create(
    @Body() createUsuarioDto: CreateUsuarioDto,
  ): Promise<BaseResponseDto<UsuarioResponseDto>> {
    return this.usuarioService.create(createUsuarioDto);
  }

  @Post('with-trabajador')
  @ApiOperation({ summary: 'Crear usuario y trabajador en una sola transaccion' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Usuario y trabajador creados exitosamente',
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResponseDto) },
        {
          properties: {
            data: {
              $ref: getSchemaPath(UsuarioTrabajadorCompositeDto),
            },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Fallo al crear el usuario o trabajador',
    schema: { $ref: getSchemaPath(BaseResponseDto) },
  })
  createWithTrabajador(
    @Body() payload: CreateUsuarioTrabajadorDto,
  ): Promise<BaseResponseDto<UsuarioTrabajadorCompositeDto>> {
    return this.usuarioService.createWithTrabajador(payload);
  }

  @Get()
  @ApiOperation({ summary: 'Listar usuarios con filtros y paginacion' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'email', required: false, type: String })
  @ApiQuery({ name: 'activo', required: false, type: Boolean })
  @ApiQuery({ name: 'rolId', required: false, type: String })
  @ApiQuery({ name: 'nombre', required: false, type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Listado de usuarios',
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResponseDto) },
        {
          properties: {
            data: { $ref: getSchemaPath(UsuarioListResponseDto) },
          },
        },
      ],
    },
  })
  findAll(
    @Query() query: UsuarioQuery,
  ): Promise<BaseResponseDto<UsuarioListResponseDto>> {
    return this.usuarioService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @ApiParam({ name: 'id', description: 'UUID del usuario' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Usuario encontrado',
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResponseDto) },
        {
          properties: {
            data: { $ref: getSchemaPath(UsuarioResponseDto) },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Usuario no encontrado',
    schema: { $ref: getSchemaPath(BaseResponseDto) },
  })
  findOne(
    @Param('id') id: string,
  ): Promise<BaseResponseDto<UsuarioResponseDto>> {
    return this.usuarioService.findOne(id);
  }

  @Get('email/:email')
  @ApiOperation({ summary: 'Obtener un usuario por email' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Usuario encontrado',
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResponseDto) },
        {
          properties: {
            data: { $ref: getSchemaPath(UsuarioResponseDto) },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Usuario no encontrado',
    schema: { $ref: getSchemaPath(BaseResponseDto) },
  })
  findByEmail(
    @Param('email') email: string,
  ): Promise<BaseResponseDto<UsuarioResponseDto>> {
    return this.usuarioService.findByEmail(email);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un usuario' })
  @ApiParam({ name: 'id', description: 'UUID del usuario' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Usuario actualizado exitosamente',
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResponseDto) },
        {
          properties: {
            data: { $ref: getSchemaPath(UsuarioResponseDto) },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Usuario no encontrado',
    schema: { $ref: getSchemaPath(BaseResponseDto) },
  })
  update(
    @Param('id') id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<BaseResponseDto<UsuarioResponseDto>> {
    return this.usuarioService.update(id, updateUsuarioDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar un usuario definitivamente' })
  @ApiParam({ name: 'id', description: 'UUID del usuario' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Usuario eliminado exitosamente',
    schema: { $ref: getSchemaPath(BaseResponseDto) },
  })
  remove(@Param('id') id: string): Promise<BaseResponseDto<null>> {
    return this.usuarioService.remove(id);
  }

  @Patch(':id/soft-delete')
  @ApiOperation({ summary: 'Desactivar un usuario (eliminacion logica)' })
  @ApiParam({ name: 'id', description: 'UUID del usuario' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Usuario desactivado exitosamente',
    schema: { $ref: getSchemaPath(BaseResponseDto) },
  })
  softDelete(@Param('id') id: string): Promise<BaseResponseDto<null>> {
    return this.usuarioService.softDelete(id);
  }

  @Patch(':id/last-access')
  @ApiOperation({ summary: 'Actualizar la fecha del ultimo acceso' })
  @ApiParam({ name: 'id', description: 'UUID del usuario' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ultimo acceso actualizado',
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResponseDto) },
        {
          properties: {
            data: { $ref: getSchemaPath(UsuarioResponseDto) },
          },
        },
      ],
    },
  })
  updateLastAccess(
    @Param('id') id: string,
  ): Promise<BaseResponseDto<UsuarioResponseDto>> {
    return this.usuarioService.updateLastAccess(id);
  }

  @Patch(':id/failed-attempts/increment')
  @ApiOperation({ summary: 'Incrementar los intentos fallidos de autenticacion' })
  @ApiParam({ name: 'id', description: 'UUID del usuario' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Intentos fallidos actualizados',
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResponseDto) },
        {
          properties: {
            data: { $ref: getSchemaPath(UsuarioResponseDto) },
          },
        },
      ],
    },
  })
  incrementFailedAttempts(
    @Param('id') id: string,
  ): Promise<BaseResponseDto<UsuarioResponseDto>> {
    return this.usuarioService.incrementFailedAttempts(id);
  }

  @Patch(':id/failed-attempts/reset')
  @ApiOperation({ summary: 'Reiniciar los intentos fallidos de autenticacion' })
  @ApiParam({ name: 'id', description: 'UUID del usuario' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Intentos fallidos reiniciados',
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResponseDto) },
        {
          properties: {
            data: { $ref: getSchemaPath(UsuarioResponseDto) },
          },
        },
      ],
    },
  })
  resetFailedAttempts(
    @Param('id') id: string,
  ): Promise<BaseResponseDto<UsuarioResponseDto>> {
    return this.usuarioService.resetFailedAttempts(id);
  }

  @Patch(':id/block')
  @ApiOperation({ summary: 'Bloquear un usuario hasta una fecha determinada' })
  @ApiParam({ name: 'id', description: 'UUID del usuario' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Usuario bloqueado exitosamente',
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResponseDto) },
        {
          properties: {
            data: { $ref: getSchemaPath(UsuarioResponseDto) },
          },
        },
      ],
    },
  })
  blockUser(
    @Param('id') id: string,
    @Body() body: BlockUsuarioDto,
  ): Promise<BaseResponseDto<UsuarioResponseDto>> {
>>>>>>> 872c80c6d7bf7361f9d25592c6a22381544844d2
    return this.usuarioService.blockUser(id, new Date(body.until));
  }
}
