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
  CreateTrabajadorDto,
  TrabajadorResponseDto,
  UpdateTrabajadorDto,
} from '../../Dtos';
import { BaseResponseDto } from '../../Dtos/baseResponse.dto';
import { Trabajador } from '../../entities/Trabajador';
import { ITrabajadorService } from '../../Services/Interfaces';

@ApiTags('Trabajador')
@ApiExtraModels(BaseResponseDto, TrabajadorResponseDto)
@Controller('trabajador')
export class TrabajadorController {
  constructor(
    @Inject('ITrabajadorService')
    private readonly trabajadorService: ITrabajadorService,
  ) { }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo trabajador' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Trabajador creado exitosamente',
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResponseDto) },
        {
          properties: {
            data: { $ref: getSchemaPath(TrabajadorResponseDto) },
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
    @Body() data: CreateTrabajadorDto,
  ): Promise<BaseResponseDto<Trabajador>> {
    return this.trabajadorService.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Listar trabajadores activos' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Listado de trabajadores activos',
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResponseDto) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(TrabajadorResponseDto) },
            },
          },
        },
      ],
    },
  })
  async findAll(): Promise<BaseResponseDto<Trabajador[]>> {
    return this.trabajadorService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un trabajador por ID' })
  @ApiParam({ name: 'id', description: 'UUID del trabajador' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Trabajador encontrado',
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResponseDto) },
        {
          properties: {
            data: { $ref: getSchemaPath(TrabajadorResponseDto) },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Trabajador no encontrado',
    schema: { $ref: getSchemaPath(BaseResponseDto) },
  })
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<BaseResponseDto<Trabajador>> {
    return this.trabajadorService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un trabajador' })
  @ApiParam({ name: 'id', description: 'UUID del trabajador' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Trabajador actualizado',
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResponseDto) },
        {
          properties: {
            data: { $ref: getSchemaPath(TrabajadorResponseDto) },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Trabajador no encontrado',
    schema: { $ref: getSchemaPath(BaseResponseDto) },
  })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() data: UpdateTrabajadorDto,
  ): Promise<BaseResponseDto<Trabajador>> {
    return this.trabajadorService.update(id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Desactivar un trabajador (eliminacion logica)' })
  @ApiParam({ name: 'id', description: 'UUID del trabajador' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Trabajador desactivado',
    schema: { $ref: getSchemaPath(BaseResponseDto) },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Trabajador no encontrado',
    schema: { $ref: getSchemaPath(BaseResponseDto) },
  })
  async remove(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<BaseResponseDto<null>> {
    return this.trabajadorService.remove(id);
  }

  @Patch(':id/reactivate')
  @ApiOperation({ summary: 'Reactivar un trabajador inactivo' })
  @ApiParam({ name: 'id', description: 'UUID del trabajador' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Trabajador reactivado',
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResponseDto) },
        {
          properties: {
            data: { $ref: getSchemaPath(TrabajadorResponseDto) },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Trabajador no encontrado o ya activo',
    schema: { $ref: getSchemaPath(BaseResponseDto) },
  })
  async reactivate(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<BaseResponseDto<Trabajador>> {
    return this.trabajadorService.reactivate(id);
  }
}
