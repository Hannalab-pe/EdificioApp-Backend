import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsuarioService } from '../../Services/Implementations/usuario/usuario.service';
import { UsuarioQuery } from '../../Services/Interfaces/usuario/iusuario.service';
import { CreateUsuarioDto } from '../../dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../../dto/update-usuario.dto';

@ApiTags('usuarios')
@Controller('usuarios')
export class UsuarioController {
    constructor(
        @Inject('IUsuarioService')
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
        return this.usuarioService.blockUser(id, new Date(body.until));
    }
}