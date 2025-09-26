import { Body, Controller, Get, Param, Post, Query, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { IHistorialContratoService } from '../../Services/Interfaces/historial-contrato/ihistorial-contrato.service';
import { CreateHistorialContratoDto, HistorialContratoResponseDto } from '../../Dtos/historial-contrato.dto';
import { BaseResponseDto } from '../../Dtos';

@ApiTags('Historial de Contratos')
@Controller('historial-contrato')
export class HistorialContratoController {

  constructor(
    @Inject('IHistorialContratoService')
    private readonly historialContratoService: IHistorialContratoService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo registro en el historial de contrato' })
  @ApiResponse({
    status: 201,
    description: 'Historial de contrato creado exitosamente',
    type: HistorialContratoResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async create(@Body() createHistorialContratoDto: CreateHistorialContratoDto) {
    return await this.historialContratoService.create(createHistorialContratoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todo el historial de contratos' })
  @ApiResponse({
    status: 200,
    description: 'Historial de contratos obtenido exitosamente',
    type: [HistorialContratoResponseDto],
  })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findAll() {
    return await this.historialContratoService.findAll();
  }

  @Get('contrato/:contratoId')
  @ApiOperation({ summary: 'Obtener el historial de un contrato específico' })
  @ApiParam({
    name: 'contratoId',
    description: 'ID del contrato',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Historial de contrato obtenido exitosamente',
    type: [HistorialContratoResponseDto],
  })
  @ApiResponse({ status: 400, description: 'ID de contrato inválido' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findByContratoId(@Param('contratoId') contratoId: string) {
    return await this.historialContratoService.findByContratoId(contratoId);
  }
}