import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseUUIDPipe,
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
  CreateTipoContratoDto,
  TipoContratoResponseDto,
  UpdateTipoContratoDto,
} from '../../Dtos';
import { BaseResponseDto } from '../../Dtos/baseResponse.dto';
import { TipoContrato } from '../../entities/TipoContrato';
import { ITipoContratoService } from '../../Services/Interfaces';

@ApiTags('Tipo Contrato')
@ApiExtraModels(BaseResponseDto, TipoContratoResponseDto)
@Controller('tipo-contrato')
export class TipoContratoController {
  constructor(
    @Inject('ITipoContratoService')
    private readonly tipoContratoService: ITipoContratoService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo tipo de contrato' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Tipo de contrato creado exitosamente',
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResponseDto) },
        {
          properties: {
            data: { $ref: getSchemaPath(TipoContratoResponseDto) },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Ya existe un tipo de contrato con el mismo nombre',
    schema: { $ref: getSchemaPath(BaseResponseDto) },
  })
  async create(
    @Body() data: CreateTipoContratoDto,
  ): Promise<BaseResponseDto<TipoContrato>> {
    return this.tipoContratoService.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Listar tipos de contrato con filtros y paginación' })
  @ApiQuery({ name: 'page', required: false, description: 'Página a consultar', type: Number })
  @ApiQuery({ name: 'limit', required: false, description: 'Cantidad por página', type: Number })
  @ApiQuery({ name: 'nombre', required: false, description: 'Filtrar por nombre' })
  @ApiQuery({ name: 'activo', required: false, description: 'Filtrar por estado activo', type: Boolean })
  @ApiQuery({ name: 'renovable', required: false, description: 'Filtrar por renovable', type: Boolean })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Listado de tipos de contrato',
    schema: { $ref: getSchemaPath(BaseResponseDto) },
  })
  async findAll(
    @Query() query: Record<string, any>,
  ): Promise<BaseResponseDto<TipoContrato>> {
    return this.tipoContratoService.findAll(query);
  }

  @Get('activos')
  @ApiOperation({ summary: 'Obtener tipos de contrato activos' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tipos de contrato activos',
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResponseDto) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(TipoContratoResponseDto) },
            },
          },
        },
      ],
    },
  })
  async findActivos(): Promise<BaseResponseDto<TipoContrato[]>> {
    return this.tipoContratoService.findActivos();
  }

  @Get('nombre/:nombre')
  @ApiOperation({ summary: 'Buscar tipo de contrato por nombre' })
  @ApiParam({ name: 'nombre', description: 'Nombre exacto del tipo de contrato' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tipo de contrato encontrado',
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResponseDto) },
        {
          properties: {
            data: { $ref: getSchemaPath(TipoContratoResponseDto) },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Tipo de contrato no encontrado',
    schema: { $ref: getSchemaPath(BaseResponseDto) },
  })
  async findByNombre(
    @Param('nombre') nombre: string,
  ): Promise<BaseResponseDto<TipoContrato>> {
    return this.tipoContratoService.findByNombre(nombre);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un tipo de contrato por ID' })
  @ApiParam({ name: 'id', description: 'UUID del tipo de contrato' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tipo de contrato encontrado',
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResponseDto) },
        {
          properties: {
            data: { $ref: getSchemaPath(TipoContratoResponseDto) },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Tipo de contrato no encontrado',
    schema: { $ref: getSchemaPath(BaseResponseDto) },
  })
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<BaseResponseDto<TipoContrato>> {
    return this.tipoContratoService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un tipo de contrato' })
  @ApiParam({ name: 'id', description: 'UUID del tipo de contrato' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tipo de contrato actualizado',
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResponseDto) },
        {
          properties: {
            data: { $ref: getSchemaPath(TipoContratoResponseDto) },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Tipo de contrato no encontrado',
    schema: { $ref: getSchemaPath(BaseResponseDto) },
  })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() data: UpdateTipoContratoDto,
  ): Promise<BaseResponseDto<TipoContrato>> {
    return this.tipoContratoService.update(id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar lógicamente un tipo de contrato' })
  @ApiParam({ name: 'id', description: 'UUID del tipo de contrato' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tipo de contrato eliminado correctamente',
    schema: { $ref: getSchemaPath(BaseResponseDto) },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Tipo de contrato no encontrado',
    schema: { $ref: getSchemaPath(BaseResponseDto) },
  })
  async remove(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<BaseResponseDto<void>> {
    return this.tipoContratoService.remove(id);
  }
}
