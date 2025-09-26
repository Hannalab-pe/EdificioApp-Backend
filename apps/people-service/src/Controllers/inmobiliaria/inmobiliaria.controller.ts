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
  CreateInmobiliariaDto,
  InmobiliariaResponseDto,
  UpdateInmobiliariaDto,
} from '../../Dtos';
import { BaseResponseDto } from '../../Dtos/baseResponse.dto';
import { Inmobiliaria } from '../../entities/Inmobiliaria';
import { IInmobiliariaService } from '../../Services/Interfaces';

@ApiTags('Inmobiliaria')
@ApiExtraModels(BaseResponseDto, InmobiliariaResponseDto)
@Controller('inmobiliaria')
export class InmobiliariaController {
  constructor(
    @Inject('IInmobiliariaService')
    private readonly inmobiliariaService: IInmobiliariaService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva inmobiliaria' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Inmobiliaria creada exitosamente',
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResponseDto) },
        {
          properties: {
            data: { $ref: getSchemaPath(InmobiliariaResponseDto) },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Solicitud invalida o datos duplicados',
  })
  async create(
    @Body() data: CreateInmobiliariaDto,
  ): Promise<BaseResponseDto<Inmobiliaria>> {
    return this.inmobiliariaService.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Listar inmobiliarias activas' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Listado de inmobiliarias activo',
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResponseDto) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(InmobiliariaResponseDto) },
            },
          },
        },
      ],
    },
  })
  async findAll(): Promise<BaseResponseDto<Inmobiliaria[]>> {
    return this.inmobiliariaService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una inmobiliaria por ID' })
  @ApiParam({ name: 'id', description: 'UUID de la inmobiliaria' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Inmobiliaria encontrada',
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResponseDto) },
        {
          properties: {
            data: { $ref: getSchemaPath(InmobiliariaResponseDto) },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Inmobiliaria no encontrada',
    schema: { $ref: getSchemaPath(BaseResponseDto) },
  })
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<BaseResponseDto<Inmobiliaria>> {
    return this.inmobiliariaService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una inmobiliaria' })
  @ApiParam({ name: 'id', description: 'UUID de la inmobiliaria' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Inmobiliaria actualizada exitosamente',
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResponseDto) },
        {
          properties: {
            data: { $ref: getSchemaPath(InmobiliariaResponseDto) },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Inmobiliaria no encontrada',
    schema: { $ref: getSchemaPath(BaseResponseDto) },
  })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() data: UpdateInmobiliariaDto,
  ): Promise<BaseResponseDto<Inmobiliaria>> {
    return this.inmobiliariaService.update(id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Desactivar una inmobiliaria (eliminacion logica)' })
  @ApiParam({ name: 'id', description: 'UUID de la inmobiliaria' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Inmobiliaria desactivada',
    schema: { $ref: getSchemaPath(BaseResponseDto) },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Inmobiliaria no encontrada',
    schema: { $ref: getSchemaPath(BaseResponseDto) },
  })
  async remove(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<BaseResponseDto<null>> {
    return this.inmobiliariaService.remove(id);
  }

  @Patch(':id/reactivate')
  @ApiOperation({ summary: 'Reactivar una inmobiliaria inactiva' })
  @ApiParam({ name: 'id', description: 'UUID de la inmobiliaria' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Inmobiliaria reactivada',
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResponseDto) },
        {
          properties: {
            data: { $ref: getSchemaPath(InmobiliariaResponseDto) },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Inmobiliaria no encontrada o ya activa',
    schema: { $ref: getSchemaPath(BaseResponseDto) },
  })
  async reactivate(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<BaseResponseDto<Inmobiliaria>> {
    return this.inmobiliariaService.reactivate(id);
  }
}
