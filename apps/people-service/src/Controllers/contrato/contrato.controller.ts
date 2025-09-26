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
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  BaseResponseDto,
  ContratoResponseDto,
  CreateContratoDto,
  UpdateContratoDto,
} from '../../Dtos';
import { Contrato } from '../../entities/Contrato';
import { IContratoService } from '../../Services/Interfaces';

@ApiTags('Contrato')
@ApiExtraModels(BaseResponseDto, ContratoResponseDto)
@Controller('contrato')
export class ContratoController {
  constructor(
    @Inject('IContratoService')
    private readonly contratoService: IContratoService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo contrato' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Contrato creado exitosamente',
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResponseDto) },
        {
          properties: {
            data: { $ref: getSchemaPath(ContratoResponseDto) },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Solicitud invalida o datos duplicados',
    schema: { $ref: getSchemaPath(BaseResponseDto) },
  })
  async create(
    @Body() data: CreateContratoDto,
  ): Promise<BaseResponseDto<Contrato>> {
    return await  this.contratoService.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Listar contratos' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Listado de contratos',
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResponseDto) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(ContratoResponseDto) },
            },
          },
        },
      ],
    },
  })
  async findAll(): Promise<BaseResponseDto<Contrato[]>> {
    return this.contratoService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un contrato por ID' })
  @ApiParam({ name: 'id', description: 'UUID del contrato' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Contrato encontrado',
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResponseDto) },
        {
          properties: {
            data: { $ref: getSchemaPath(ContratoResponseDto) },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Contrato no encontrado',
    schema: { $ref: getSchemaPath(BaseResponseDto) },
  })
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<BaseResponseDto<Contrato>> {
    return this.contratoService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un contrato' })
  @ApiParam({ name: 'id', description: 'UUID del contrato' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Contrato actualizado',
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResponseDto) },
        {
          properties: {
            data: { $ref: getSchemaPath(ContratoResponseDto) },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Contrato no encontrado',
    schema: { $ref: getSchemaPath(BaseResponseDto) },
  })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() data: UpdateContratoDto,
  ): Promise<BaseResponseDto<Contrato>> {
    return this.contratoService.update(id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar lógicamente un contrato' })
  @ApiParam({ name: 'id', description: 'UUID del contrato' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Contrato eliminado lógicamente',
    schema: { $ref: getSchemaPath(BaseResponseDto) },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Contrato no encontrado',
    schema: { $ref: getSchemaPath(BaseResponseDto) },
  })
  async remove(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<BaseResponseDto<void>> {
    return this.contratoService.removeLogical(id);
  }
}
