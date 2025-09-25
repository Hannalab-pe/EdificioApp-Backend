import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { UsersService } from './users/users.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { NivelAcceso } from './entities/rol.entity';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './dto/user.dto';

@ApiTags('Users Management')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(NivelAcceso.ADMIN)
  @ApiOperation({ summary: 'Obtener lista de usuarios' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios', type: [UserResponseDto] })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Límite de resultados por página' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Término de búsqueda' })
  @ApiQuery({ name: 'activo', required: false, type: Boolean, description: 'Filtrar por estado activo' })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
    @Query('activo') activo?: boolean,
  ) {
    return this.usersService.findAll({ page, limit, search, activo });
  }

  @Get(':id')
  @Roles(NivelAcceso.ADMIN)
  @ApiOperation({ summary: 'Obtener usuario por ID' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del usuario' })
  async findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  @Post()
  @Roles(NivelAcceso.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente', type: UserResponseDto })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 409, description: 'Email o documento ya registrado' })
  @ApiBody({ type: CreateUserDto })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Put(':id')
  @Roles(NivelAcceso.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar usuario' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado exitosamente', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del usuario' })
  @ApiBody({ type: UpdateUserDto })
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(NivelAcceso.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar usuario (soft delete)' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del usuario' })
  async remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }

  @Put(':id/activate')
  @Roles(NivelAcceso.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Activar usuario' })
  @ApiResponse({ status: 200, description: 'Usuario activado exitosamente' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del usuario' })
  async activate(@Param('id') id: number) {
    return this.usersService.activate(id);
  }

  @Put(':id/deactivate')
  @Roles(NivelAcceso.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Desactivar usuario' })
  @ApiResponse({ status: 200, description: 'Usuario desactivado exitosamente' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del usuario' })
  async deactivate(@Param('id') id: number) {
    return this.usersService.deactivate(id);
  }

  @Put(':id/reset-password')
  @Roles(NivelAcceso.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Restablecer contraseña de usuario' })
  @ApiResponse({ status: 200, description: 'Contraseña restablecida exitosamente' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del usuario' })
  async resetPassword(@Param('id') id: number) {
    return this.usersService.resetPassword(id);
  }
}