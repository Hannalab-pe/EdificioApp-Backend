import { HttpStatus, Injectable, Inject } from '@nestjs/common';
import { IContratoService } from '../../Interfaces';
import { CreateContratoDto, BaseResponseDto, UpdateContratoDto, CreateHistorialContratoDto } from 'apps/people-service/src/Dtos';
import { Contrato } from 'apps/people-service/src/entities/Contrato';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrabajadorService } from '../trabajador/trabajador.service';
import { TipoContratoService } from '../tipo-contrato/tipo-contrato.service';
import { IHistorialContratoService } from '../../Interfaces/historial-contrato/ihistorial-contrato.service';
import { SecurityServiceClient } from '../../clients/security-service.client';
import { ACCION_CONTRATO } from 'apps/people-service/src/Enum/contrato.enum';

@Injectable()
export class ContratoService implements IContratoService {

    constructor(
        @InjectRepository(Contrato) private contratoRepository: Repository<Contrato>,
        private readonly trabajadorService: TrabajadorService,
        private readonly tipoContratoService: TipoContratoService,
        @Inject('IHistorialContratoService')
        private readonly historialContratoService: IHistorialContratoService,
        private readonly securityServiceClient: SecurityServiceClient,
    ) { }

    async create(data: CreateContratoDto): Promise<BaseResponseDto<Contrato>> {
        try {
            if (!data) {
                return await BaseResponseDto.error<Contrato>('No se proporcionaron datos para crear el contrato.', HttpStatus.BAD_REQUEST);
            }

            // Validar usuario responsable si se proporciona
            if (data.usuarioResponsableId) {
                const usuarioValidation = await this.securityServiceClient.validateUsuarioActive(data.usuarioResponsableId);

                if (!usuarioValidation.exists) {
                    return BaseResponseDto.error<Contrato>(
                        'El usuario responsable no existe en el sistema.',
                        HttpStatus.BAD_REQUEST
                    );
                }

                if (!usuarioValidation.active) {
                    return BaseResponseDto.error<Contrato>(
                        'El usuario responsable no está activo en el sistema.',
                        HttpStatus.BAD_REQUEST
                    );
                }
            }

            const tipoContratoFound = await this.tipoContratoService.findOne(data.tipoContratoId);
            const trabajadorFound = await this.trabajadorService.findOne(data.trabajadorId);
            if (!trabajadorFound) {
                return await BaseResponseDto.error<Contrato>('Trabajador no encontrado.', HttpStatus.NOT_FOUND);
            }

            if (!tipoContratoFound) {
                return await BaseResponseDto.error<Contrato>('Tipo de contrato no encontrado.', HttpStatus.NOT_FOUND);
            }

            // Si ambos existen, se puede crear el contrato
            const newContrato = this.contratoRepository.create({
                ...data,
                salario: trabajadorFound.data.salario,
                tipoContrato: tipoContratoFound.data,
                trabajador: trabajadorFound.data,
            });
            const savedContrato = await this.contratoRepository.save(newContrato);

            // Crear registro en el historial de contrato
            await this.createHistorialEntry(savedContrato.id, ACCION_CONTRATO.ACCION_CREADO, 'Contrato creado inicialmente', {
                tipoContrato: tipoContratoFound.data.nombre,
                trabajador: `${trabajadorFound.data.nombre} ${trabajadorFound.data.apellidos}`,
                salario: savedContrato.salario,
                fechaInicio: savedContrato.fechaInicio,
                fechaFin: savedContrato.fechaFin,
            }, data.usuarioResponsableId);

            return BaseResponseDto.success<Contrato>(savedContrato, 'Contrato creado exitosamente.', HttpStatus.CREATED);
        } catch (error) {
            return BaseResponseDto.error<Contrato>('Error al crear el contrato: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    findAll(): Promise<BaseResponseDto<Contrato[]>> {
        throw new Error('Method not implemented.');
    }
    findOne(id: string): Promise<BaseResponseDto<Contrato>> {
        throw new Error('Method not implemented.');
    }
    update(id: string, data: UpdateContratoDto): Promise<BaseResponseDto<Contrato>> {
        throw new Error('Method not implemented.');
    }
    removeLogical(id: string): Promise<BaseResponseDto<void>> {
        throw new Error('Method not implemented.');
    }

    private async createHistorialEntry(
        contratoId: string,
        accion: ACCION_CONTRATO,
        motivo: string,
        detalles?: object,
        usuarioResponsableId?: string
    ): Promise<void> {
        try {
            const historialData: CreateHistorialContratoDto = {
                contratoId,
                accion: accion as ACCION_CONTRATO,
                fechaAccion: new Date().toISOString().split('T')[0], // YYYY-MM-DD
                motivo,
                detalles,
                usuarioResponsableId,
            };

            await this.historialContratoService.create(historialData);
        } catch (error) {
            console.error('Error al crear entrada de historial:', error);
        }
    }
}
