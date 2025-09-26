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
import { RolService } from '../../Services/Implementations/rol/rol.service';
import { RolQuery } from '../../Services/Interfaces/rol/irol.service';
import { CreateRolDto } from '../../dto/create-rol.dto';
import { UpdateRolDto } from '../../dto/update-rol.dto';
import { NivelAcceso } from '../../entities/Rol';

@ApiTags('roles')
@Controller('roles')
export class RolController {
  constructor(
    @Inject('IRolService')
    private readonly rolService: RolService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear nuevo rol' })
  @ApiResponse({ status: 201, description: 'Rol creado exitosamente.' })
  @ApiResponse({ status: 409, description: 'Ya existe un rol con ese nombre.' })
  create(@Body() createRolDto: CreateRolDto) {
    return this.rolService.create(createRolDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar roles con paginación y filtros' })
  @ApiResponse({
    status: 200,
    description: 'Lista de roles obtenida exitosamente.',
  })
  findAll(@Query() query: RolQuery) {
    return this.rolService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolService.findOne(id);
  }

  @Get('name/:nombre')
  findByName(@Param('nombre') nombre: string) {
    return this.rolService.findByName(nombre);
  }

  @Get('nivel-acceso/:nivelAcceso')
  findByNivelAcceso(@Param('nivelAcceso') nivelAcceso: NivelAcceso) {
    return this.rolService.findByNivelAcceso(nivelAcceso);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRolDto: UpdateRolDto) {
    return this.rolService.update(id, updateRolDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolService.remove(id);
  }

  @Patch(':id/soft-delete')
  softDelete(@Param('id') id: string) {
    return this.rolService.softDelete(id);
  }
}
