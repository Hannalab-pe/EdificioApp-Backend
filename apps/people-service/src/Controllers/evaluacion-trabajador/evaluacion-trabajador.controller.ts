import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { IEvaluacionTrabajadorService, EvaluacionTrabajadorQuery } from '../../Services/Interfaces/evaluacion-trabajador/ievaluacion-trabajador.service';
import { CreateEvaluacionTrabajadorDto, UpdateEvaluacionTrabajadorDto, EvaluacionTrabajadorResponseDto } from '../../Dtos/evaluacion-trabajador.dto';

@ApiTags('Evaluaciones de Trabajadores')
@Controller('evaluacion-trabajador')
export class EvaluacionTrabajadorController {

  constructor(
    @Inject('IEvaluacionTrabajadorService')
    private readonly evaluacionTrabajadorService: IEvaluacionTrabajadorService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva evaluación de trabajador' })
  @ApiResponse({
    status: 201,
    description: 'Evaluación creada exitosamente',
    type: EvaluacionTrabajadorResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos o evaluador no válido' })
  @ApiResponse({ status: 404, description: 'Trabajador no encontrado' })
  @ApiResponse({ status: 409, description: 'Ya existe una evaluación para el período' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async create(@Body() createEvaluacionTrabajadorDto: CreateEvaluacionTrabajadorDto) {
    return await this.evaluacionTrabajadorService.create(createEvaluacionTrabajadorDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las evaluaciones con filtros opcionales' })
  @ApiQuery({ name: 'page', required: false, description: 'Número de página', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Elementos por página', example: 10 })
  @ApiQuery({ name: 'trabajadorId', required: false, description: 'Filtrar por ID de trabajador' })
  @ApiQuery({ name: 'evaluadorId', required: false, description: 'Filtrar por ID de evaluador' })
  @ApiQuery({ name: 'periodo', required: false, description: 'Filtrar por período (YYYY-MM)', example: '2024-01' })
  @ApiQuery({ name: 'fechaEvaluacionDesde', required: false, description: 'Fecha de evaluación desde (YYYY-MM-DD)' })
  @ApiQuery({ name: 'fechaEvaluacionHasta', required: false, description: 'Fecha de evaluación hasta (YYYY-MM-DD)' })
  @ApiResponse({
    status: 200,
    description: 'Evaluaciones obtenidas exitosamente',
    type: [EvaluacionTrabajadorResponseDto],
  })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findAll(@Query() query: EvaluacionTrabajadorQuery) {
    return await this.evaluacionTrabajadorService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una evaluación específica por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID de la evaluación',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Evaluación obtenida exitosamente',
    type: EvaluacionTrabajadorResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Evaluación no encontrada' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findOne(@Param('id') id: string) {
    return await this.evaluacionTrabajadorService.findOne(id);
  }

  @Get('trabajador/:trabajadorId')
  @ApiOperation({ summary: 'Obtener todas las evaluaciones de un trabajador específico' })
  @ApiParam({
    name: 'trabajadorId',
    description: 'ID del trabajador',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Evaluaciones del trabajador obtenidas exitosamente',
    type: [EvaluacionTrabajadorResponseDto],
  })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findByTrabajadorId(@Param('trabajadorId') trabajadorId: string) {
    return await this.evaluacionTrabajadorService.findByTrabajadorId(trabajadorId);
  }

  @Get('evaluador/:evaluadorId')
  @ApiOperation({ summary: 'Obtener todas las evaluaciones realizadas por un evaluador específico' })
  @ApiParam({
    name: 'evaluadorId',
    description: 'ID del evaluador',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Evaluaciones del evaluador obtenidas exitosamente',
    type: [EvaluacionTrabajadorResponseDto],
  })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findByEvaluadorId(@Param('evaluadorId') evaluadorId: string) {
    return await this.evaluacionTrabajadorService.findByEvaluadorId(evaluadorId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una evaluación existente' })
  @ApiParam({
    name: 'id',
    description: 'ID de la evaluación',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Evaluación actualizada exitosamente',
    type: EvaluacionTrabajadorResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos o evaluador no válido' })
  @ApiResponse({ status: 404, description: 'Evaluación no encontrada' })
  @ApiResponse({ status: 409, description: 'Conflicto con período existente' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async update(
    @Param('id') id: string,
    @Body() updateEvaluacionTrabajadorDto: UpdateEvaluacionTrabajadorDto
  ) {
    return await this.evaluacionTrabajadorService.update(id, updateEvaluacionTrabajadorDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una evaluación' })
  @ApiParam({
    name: 'id',
    description: 'ID de la evaluación',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Evaluación eliminada exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Evaluación no encontrada' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async remove(@Param('id') id: string) {
    return await this.evaluacionTrabajadorService.remove(id);
  }
}
