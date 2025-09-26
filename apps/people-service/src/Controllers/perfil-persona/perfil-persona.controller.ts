import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { IPerfilPersonaService, PerfilPersonaQuery } from '../../Services/Interfaces/perfil-persona/iperfil-persona.service';
import { CreatePerfilPersonaDto, UpdatePerfilPersonaDto, PerfilPersonaResponseDto } from '../../Dtos/perfil-persona.dto';

@ApiTags('Perfiles de Personas')
@Controller('perfil-persona')
export class PerfilPersonaController {

  constructor(
    @Inject('IPerfilPersonaService')
    private readonly perfilPersonaService: IPerfilPersonaService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo perfil de persona' })
  @ApiResponse({
    status: 201,
    description: 'Perfil creado exitosamente',
    type: PerfilPersonaResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos o usuario no válido' })
  @ApiResponse({ status: 409, description: 'Ya existe un perfil para este usuario' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async create(@Body() createPerfilPersonaDto: CreatePerfilPersonaDto) {
    return await this.perfilPersonaService.create(createPerfilPersonaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los perfiles con filtros opcionales' })
  @ApiQuery({ name: 'page', required: false, description: 'Número de página', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Elementos por página', example: 10 })
  @ApiQuery({ name: 'usuarioId', required: false, description: 'Filtrar por ID de usuario' })
  @ApiQuery({ name: 'estadoCivil', required: false, description: 'Filtrar por estado civil' })
  @ApiQuery({ name: 'profesion', required: false, description: 'Filtrar por profesión' })
  @ApiResponse({
    status: 200,
    description: 'Perfiles obtenidos exitosamente',
    type: [PerfilPersonaResponseDto],
  })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findAll(@Query() query: PerfilPersonaQuery) {
    return await this.perfilPersonaService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un perfil específico por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID del perfil',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil obtenido exitosamente',
    type: PerfilPersonaResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Perfil no encontrado' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findOne(@Param('id') id: string) {
    return await this.perfilPersonaService.findOne(id);
  }

  @Get('usuario/:usuarioId')
  @ApiOperation({ summary: 'Obtener el perfil de un usuario específico' })
  @ApiParam({
    name: 'usuarioId',
    description: 'ID del usuario',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil del usuario obtenido exitosamente',
    type: PerfilPersonaResponseDto,
  })
  @ApiResponse({ status: 404, description: 'No se encontró perfil para este usuario' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findByUsuarioId(@Param('usuarioId') usuarioId: string) {
    return await this.perfilPersonaService.findByUsuarioId(usuarioId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un perfil existente' })
  @ApiParam({
    name: 'id',
    description: 'ID del perfil',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil actualizado exitosamente',
    type: PerfilPersonaResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Usuario asociado no válido' })
  @ApiResponse({ status: 404, description: 'Perfil no encontrado' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async update(
    @Param('id') id: string,
    @Body() updatePerfilPersonaDto: UpdatePerfilPersonaDto
  ) {
    return await this.perfilPersonaService.update(id, updatePerfilPersonaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un perfil' })
  @ApiParam({
    name: 'id',
    description: 'ID del perfil',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil eliminado exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Perfil no encontrado' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async remove(@Param('id') id: string) {
    return await this.perfilPersonaService.remove(id);
  }
}
