import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IHistorialContratoService } from '../../Interfaces/historial-contrato/ihistorial-contrato.service';
import { HistorialContrato } from '../../../entities/HistorialContrato';
import { SecurityServiceClient } from '../../clients/security-service.client';
import { BaseResponseDto, CreateHistorialContratoDto, HistorialContratoResponseDto } from 'apps/people-service/src/Dtos';
import { ACCION_CONTRATO } from 'apps/people-service/src/Enum/contrato.enum';

@Injectable()
export class HistorialContratoService implements IHistorialContratoService {

  constructor(
    @InjectRepository(HistorialContrato)
    private historialContratoRepository: Repository<HistorialContrato>,
    private readonly securityServiceClient: SecurityServiceClient,
  ) {}

  async create(data: CreateHistorialContratoDto): Promise<BaseResponseDto<HistorialContrato>> {
    try {
      if (!data) {
        return BaseResponseDto.error<HistorialContrato>(
          'No se proporcionaron datos para crear el historial de contrato.',
          HttpStatus.BAD_REQUEST
        );
      }

      // Validar usuario responsable si se proporciona
      if (data.usuarioResponsableId) {
        const usuarioValidation = await this.securityServiceClient.validateUsuarioActive(data.usuarioResponsableId);

        if (!usuarioValidation.exists) {
          return BaseResponseDto.error<HistorialContrato>(
            'El usuario responsable no existe en el sistema.',
            HttpStatus.BAD_REQUEST
          );
        }

        if (!usuarioValidation.active) {
          return BaseResponseDto.error<HistorialContrato>(
            'El usuario responsable no está activo en el sistema.',
            HttpStatus.BAD_REQUEST
          );
        }
      }

      const newHistorial = this.historialContratoRepository.create({
        contrato: { id: data.contratoId } as any,
        accion: data.accion,
        fechaAccion: data.fechaAccion,
        motivo: data.motivo,
        detalles: data.detalles,
        usuarioResponsableId: data.usuarioResponsableId,
      });

      const savedHistorial = await this.historialContratoRepository.save(newHistorial);

      return BaseResponseDto.success<HistorialContrato>(
        savedHistorial,
        'Historial de contrato creado exitosamente.',
        HttpStatus.CREATED
      );
    } catch (error) {
      return BaseResponseDto.error<HistorialContrato>(
        'Error al crear el historial de contrato: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findByContratoId(contratoId: string): Promise<BaseResponseDto<HistorialContratoResponseDto[]>> {
    try {
      const historiales = await this.historialContratoRepository.find({
        where: { contrato: { id: contratoId } },
        relations: ['contrato'],
        order: { createdAt: 'DESC' },
      });

      const historialesWithUsuarios = await this.enrichWithUsuarioData(historiales);

      return BaseResponseDto.success<HistorialContratoResponseDto[]>(
        historialesWithUsuarios,
        'Historial de contrato obtenido exitosamente.',
        HttpStatus.OK
      );
    } catch (error) {
      return BaseResponseDto.error<HistorialContratoResponseDto[]>(
        'Error al obtener el historial de contrato: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findAll(): Promise<BaseResponseDto<HistorialContratoResponseDto[]>> {
    try {
      const historiales = await this.historialContratoRepository.find({
        relations: ['contrato'],
        order: { createdAt: 'DESC' },
      });

      const historialesWithUsuarios = await this.enrichWithUsuarioData(historiales);

      return BaseResponseDto.success<HistorialContratoResponseDto[]>(
        historialesWithUsuarios,
        'Historial de contratos obtenido exitosamente.',
        HttpStatus.OK
      );
    } catch (error) {
      return BaseResponseDto.error<HistorialContratoResponseDto[]>(
        'Error al obtener el historial de contratos: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  private async enrichWithUsuarioData(historiales: HistorialContrato[]): Promise<HistorialContratoResponseDto[]> {
    const usuarioIds = historiales
      .map(h => h.usuarioResponsableId)
      .filter(id => id != null) as string[];

    const uniqueUsuarioIds = [...new Set(usuarioIds)];

    const usuariosMap = await this.securityServiceClient.getMultipleUsuarios(uniqueUsuarioIds);

    return historiales.map(historial => {
      const response = new HistorialContratoResponseDto({
        id: historial.id,
        accion: this.mapAccionToEnum(historial.accion),
        fechaAccion: historial.fechaAccion,
        motivo: historial.motivo || undefined,
        detalles: historial.detalles || undefined,
        usuarioResponsableId: historial.usuarioResponsableId || undefined,
        createdAt: historial.createdAt!,
        contrato: historial.contrato ? {
          id: historial.contrato.id,
          fechaInicio: historial.contrato.fechaInicio,
          fechaFin: historial.contrato.fechaFin || undefined,
          estado: historial.contrato.estado || '',
        } : undefined,
        usuarioResponsable: historial.usuarioResponsableId
          ? usuariosMap[historial.usuarioResponsableId]
          : undefined,
      });
      return response;
    });
  }

  private mapAccionToEnum(accion: 'CREADO' | 'MODIFICADO' | 'RENOVADO' | 'TERMINADO' | 'SUSPENDIDO'): ACCION_CONTRATO {
    const mappings = {
      'CREADO': ACCION_CONTRATO.ACCION_CREADO,
      'MODIFICADO': ACCION_CONTRATO.ACCION_MODIFICADO,
      'RENOVADO': ACCION_CONTRATO.ACCION_RENOVADO,
      'TERMINADO': ACCION_CONTRATO.ACCION_TERMINADO,
      'SUSPENDIDO': ACCION_CONTRATO.ACCION_SUSPENDIDO,
    };
    return mappings[accion];
  }
}