import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DocumentoIdentidadService } from '../../Services/Implementations/documento-identidad/documento-identidad.service';
import { DocumentoIdentidadQuery } from '../../Services/Interfaces/documento-identidad/idocumento-identidad.service';
import { CreateDocumentoIdentidadDto } from '../../dto/create-documento-identidad.dto';
import { UpdateDocumentoIdentidadDto } from '../../dto/update-documento-identidad.dto';
import { TipoDocumento } from '../../entities/DocumentoIdentidad';

@ApiTags('documentos')
@Controller('documentos-identidad')
export class DocumentoIdentidadController {
    constructor(
        @Inject('IDocumentoIdentidadService')
        private readonly documentoService: DocumentoIdentidadService,
    ) {}

    @Post()
    create(@Body() createDocumentoDto: CreateDocumentoIdentidadDto) {
        return this.documentoService.create(createDocumentoDto);
    }

    @Get()
    findAll(@Query() query: DocumentoIdentidadQuery) {
        return this.documentoService.findAll(query);
    }

    @Get('pending-validation')
    findPendingValidation() {
        return this.documentoService.findPendingValidation();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.documentoService.findOne(id);
    }

    @Get('tipo/:tipo/numero/:numero')
    findByTipoAndNumero(@Param('tipo') tipo: TipoDocumento, @Param('numero') numero: string) {
        return this.documentoService.findByTipoAndNumero(tipo, numero);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateDocumentoDto: UpdateDocumentoIdentidadDto) {
        return this.documentoService.update(id, updateDocumentoDto);
    }

    @Patch(':id/validate')
    validateDocument(@Param('id') id: string) {
        return this.documentoService.validateDocument(id);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.documentoService.remove(id);
    }
}