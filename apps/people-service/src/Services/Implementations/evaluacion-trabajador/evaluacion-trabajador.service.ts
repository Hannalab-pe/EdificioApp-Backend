import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IEvaluacionTrabajadorService, EvaluacionTrabajadorQuery } from '../../Interfaces/evaluacion-trabajador/ievaluacion-trabajador.service';
import { EvaluacionTrabajador } from '../../../entities/EvaluacionTrabajador';
import { SecurityServiceClient } from '../../clients/security-service.client';
import { TrabajadorService } from '../trabajador/trabajador.service';
import { BaseResponseDto, CreateEvaluacionTrabajadorDto, UpdateEvaluacionTrabajadorDto, EvaluacionTrabajadorResponseDto, UsuarioBasicoDto } from 'apps/people-service/src/Dtos';

@Injectable()
export class EvaluacionTrabajadorService implements IEvaluacionTrabajadorService {

  constructor(
    @InjectRepository(EvaluacionTrabajador)
    private evaluacionTrabajadorRepository: Repository<EvaluacionTrabajador>,
    private readonly securityServiceClient: SecurityServiceClient,
    private readonly trabajadorService: TrabajadorService,
  ) {}

  async create(data: CreateEvaluacionTrabajadorDto): Promise<BaseResponseDto<EvaluacionTrabajador>> {
    try {
      if (!data) {
        return BaseResponseDto.error<EvaluacionTrabajador>(
          'No se proporcionaron datos para crear la evaluación.',
          HttpStatus.BAD_REQUEST
        );
      }

      // Validar que el evaluador existe y está activo
      const evaluadorValidation = await this.securityServiceClient.validateUsuarioActive(data.evaluadorId);
      if (!evaluadorValidation.exists) {
        return BaseResponseDto.error<EvaluacionTrabajador>(
          'El evaluador no existe en el sistema.',
          HttpStatus.BAD_REQUEST
        );
      }
      if (!evaluadorValidation.active) {
        return BaseResponseDto.error<EvaluacionTrabajador>(
          'El evaluador no está activo en el sistema.',
          HttpStatus.BAD_REQUEST
        );
      }

      // Validar que el trabajador existe
      const trabajadorFound = await this.trabajadorService.findOne(data.trabajadorId);
      if (!trabajadorFound || !trabajadorFound.success) {
        return BaseResponseDto.error<EvaluacionTrabajador>(
          'El trabajador no existe.',
          HttpStatus.NOT_FOUND
        );
      }

      // Verificar que no existe una evaluación para el mismo trabajador en el mismo período
      const evaluacionExistente = await this.evaluacionTrabajadorRepository.findOne({
        where: {
          trabajadorId: data.trabajadorId,
          periodo: data.periodo,
        },
      });

      if (evaluacionExistente) {
        return BaseResponseDto.error<EvaluacionTrabajador>(
          `Ya existe una evaluación para el trabajador en el período ${data.periodo}.`,
          HttpStatus.CONFLICT
        );
      }

      // Calcular puntaje total si se proporcionaron calificaciones
      let puntajeTotal: string | undefined;
      if (data.puntualidad || data.calidadTrabajo || data.actitud || data.colaboracion) {
        const calificaciones = [
          data.puntualidad || 0,
          data.calidadTrabajo || 0,
          data.actitud || 0,
          data.colaboracion || 0,
        ].filter(c => c > 0);

        if (calificaciones.length > 0) {
          const promedio = calificaciones.reduce((sum, cal) => sum + cal, 0) / calificaciones.length;
          puntajeTotal = promedio.toFixed(2);
        }
      }

      const newEvaluacion = this.evaluacionTrabajadorRepository.create({
        ...data,
        puntajeTotal: data.puntajeTotal || puntajeTotal,
        trabajador: { id: data.trabajadorId } as any,
      });

      const savedEvaluacion = await this.evaluacionTrabajadorRepository.save(newEvaluacion);

      return BaseResponseDto.success<EvaluacionTrabajador>(
        savedEvaluacion,
        'Evaluación de trabajador creada exitosamente.',
        HttpStatus.CREATED
      );
    } catch (error) {
      return BaseResponseDto.error<EvaluacionTrabajador>(
        'Error al crear la evaluación de trabajador: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findAll(query: EvaluacionTrabajadorQuery = {}): Promise<BaseResponseDto<{ evaluaciones: EvaluacionTrabajadorResponseDto[], total: number, page: number, totalPages: number }>> {
    try {
      const { page = 1, limit = 10, trabajadorId, evaluadorId, periodo, fechaEvaluacionDesde, fechaEvaluacionHasta } = query;

      const qb = this.evaluacionTrabajadorRepository
        .createQueryBuilder('evaluacion')
        .leftJoinAndSelect('evaluacion.trabajador', 'trabajador');

      if (trabajadorId) {
        qb.andWhere('evaluacion.trabajadorId = :trabajadorId', { trabajadorId });
      }

      if (evaluadorId) {
        qb.andWhere('evaluacion.evaluadorId = :evaluadorId', { evaluadorId });
      }

      if (periodo) {
        qb.andWhere('evaluacion.periodo = :periodo', { periodo });
      }

      if (fechaEvaluacionDesde) {
        qb.andWhere('evaluacion.fechaEvaluacion >= :fechaDesde', { fechaDesde: fechaEvaluacionDesde });
      }

      if (fechaEvaluacionHasta) {
        qb.andWhere('evaluacion.fechaEvaluacion <= :fechaHasta', { fechaHasta: fechaEvaluacionHasta });
      }

      qb.skip((page - 1) * limit)
        .take(limit)
        .orderBy('evaluacion.fechaEvaluacion', 'DESC');

      const [evaluaciones, total] = await qb.getManyAndCount();
      const totalPages = Math.ceil(total / limit) || 1;

      const evaluacionesEnriquecidas = await this.enrichWithEvaluadorData(evaluaciones);

      return BaseResponseDto.success({
        evaluaciones: evaluacionesEnriquecidas,
        total,
        page,
        totalPages,
      }, 'Evaluaciones obtenidas exitosamente.', HttpStatus.OK);
    } catch (error) {
      return BaseResponseDto.error(
        'Error al obtener las evaluaciones: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findOne(id: string): Promise<BaseResponseDto<EvaluacionTrabajadorResponseDto>> {
    try {
      const evaluacion = await this.evaluacionTrabajadorRepository.findOne({
        where: { id },
        relations: ['trabajador'],
      });

      if (!evaluacion) {
        return BaseResponseDto.error(
          'Evaluación no encontrada.',
          HttpStatus.NOT_FOUND
        );
      }

      const [evaluacionEnriquecida] = await this.enrichWithEvaluadorData([evaluacion]);

      return BaseResponseDto.success(
        evaluacionEnriquecida,
        'Evaluación obtenida exitosamente.',
        HttpStatus.OK
      );
    } catch (error) {
      return BaseResponseDto.error(
        'Error al obtener la evaluación: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findByTrabajadorId(trabajadorId: string): Promise<BaseResponseDto<EvaluacionTrabajadorResponseDto[]>> {
    try {
      const evaluaciones = await this.evaluacionTrabajadorRepository.find({
        where: { trabajadorId },
        relations: ['trabajador'],
        order: { fechaEvaluacion: 'DESC' },
      });

      const evaluacionesEnriquecidas = await this.enrichWithEvaluadorData(evaluaciones);

      return BaseResponseDto.success(
        evaluacionesEnriquecidas,
        'Evaluaciones del trabajador obtenidas exitosamente.',
        HttpStatus.OK
      );
    } catch (error) {
      return BaseResponseDto.error(
        'Error al obtener las evaluaciones del trabajador: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findByEvaluadorId(evaluadorId: string): Promise<BaseResponseDto<EvaluacionTrabajadorResponseDto[]>> {
    try {
      const evaluaciones = await this.evaluacionTrabajadorRepository.find({
        where: { evaluadorId },
        relations: ['trabajador'],
        order: { fechaEvaluacion: 'DESC' },
      });

      const evaluacionesEnriquecidas = await this.enrichWithEvaluadorData(evaluaciones);

      return BaseResponseDto.success(
        evaluacionesEnriquecidas,
        'Evaluaciones del evaluador obtenidas exitosamente.',
        HttpStatus.OK
      );
    } catch (error) {
      return BaseResponseDto.error(
        'Error al obtener las evaluaciones del evaluador: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async update(id: string, data: UpdateEvaluacionTrabajadorDto): Promise<BaseResponseDto<EvaluacionTrabajador>> {
    try {
      const evaluacionExistente = await this.evaluacionTrabajadorRepository.findOne({
        where: { id },
      });

      if (!evaluacionExistente) {
        return BaseResponseDto.error<EvaluacionTrabajador>(
          'Evaluación no encontrada.',
          HttpStatus.NOT_FOUND
        );
      }

      // Validar evaluador si se está cambiando
      if (data.evaluadorId && data.evaluadorId !== evaluacionExistente.evaluadorId) {
        const evaluadorValidation = await this.securityServiceClient.validateUsuarioActive(data.evaluadorId);
        if (!evaluadorValidation.exists) {
          return BaseResponseDto.error<EvaluacionTrabajador>(
            'El nuevo evaluador no existe en el sistema.',
            HttpStatus.BAD_REQUEST
          );
        }
        if (!evaluadorValidation.active) {
          return BaseResponseDto.error<EvaluacionTrabajador>(
            'El nuevo evaluador no está activo en el sistema.',
            HttpStatus.BAD_REQUEST
          );
        }
      }

      // Verificar unicidad del período si se está cambiando
      if (data.periodo && data.periodo !== evaluacionExistente.periodo) {
        const evaluacionConflicto = await this.evaluacionTrabajadorRepository.findOne({
          where: {
            trabajadorId: evaluacionExistente.trabajadorId,
            periodo: data.periodo,
          },
        });

        if (evaluacionConflicto) {
          return BaseResponseDto.error<EvaluacionTrabajador>(
            `Ya existe una evaluación para el trabajador en el período ${data.periodo}.`,
            HttpStatus.CONFLICT
          );
        }
      }

      // Recalcular puntaje total si se actualizaron calificaciones
      let puntajeTotal = data.puntajeTotal;
      if (!puntajeTotal && (data.puntualidad !== undefined || data.calidadTrabajo !== undefined || data.actitud !== undefined || data.colaboracion !== undefined)) {
        const calificaciones = [
          data.puntualidad ?? evaluacionExistente.puntualidad ?? 0,
          data.calidadTrabajo ?? evaluacionExistente.calidadTrabajo ?? 0,
          data.actitud ?? evaluacionExistente.actitud ?? 0,
          data.colaboracion ?? evaluacionExistente.colaboracion ?? 0,
        ].filter(c => c > 0);

        if (calificaciones.length > 0) {
          const promedio = calificaciones.reduce((sum, cal) => sum + cal, 0) / calificaciones.length;
          puntajeTotal = promedio.toFixed(2);
        }
      }

      Object.assign(evaluacionExistente, data, { puntajeTotal });
      const savedEvaluacion = await this.evaluacionTrabajadorRepository.save(evaluacionExistente);

      return BaseResponseDto.success<EvaluacionTrabajador>(
        savedEvaluacion,
        'Evaluación actualizada exitosamente.',
        HttpStatus.OK
      );
    } catch (error) {
      return BaseResponseDto.error<EvaluacionTrabajador>(
        'Error al actualizar la evaluación: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async remove(id: string): Promise<BaseResponseDto<void>> {
    try {
      const evaluacion = await this.evaluacionTrabajadorRepository.findOne({
        where: { id },
      });

      if (!evaluacion) {
        return BaseResponseDto.error<void>(
          'Evaluación no encontrada.',
          HttpStatus.NOT_FOUND
        );
      }

      await this.evaluacionTrabajadorRepository.remove(evaluacion);

      return BaseResponseDto.success<void>(
        undefined,
        'Evaluación eliminada exitosamente.',
        HttpStatus.OK
      );
    } catch (error) {
      return BaseResponseDto.error<void>(
        'Error al eliminar la evaluación: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  private async enrichWithEvaluadorData(evaluaciones: EvaluacionTrabajador[]): Promise<EvaluacionTrabajadorResponseDto[]> {
    const evaluadorIds = evaluaciones
      .map(e => e.evaluadorId)
      .filter(id => id != null);

    const uniqueEvaluadorIds = [...new Set(evaluadorIds)];
    const evaluadoresMap = await this.securityServiceClient.getMultipleUsuarios(uniqueEvaluadorIds);

    return evaluaciones.map(evaluacion => {
      const calificaciones = [
        evaluacion.puntualidad,
        evaluacion.calidadTrabajo,
        evaluacion.actitud,
        evaluacion.colaboracion,
      ].filter(c => c != null && c > 0);

      const promedioCalificaciones = calificaciones.length > 0
        ? calificaciones.reduce((sum, cal) => sum + cal!, 0) / calificaciones.length
        : undefined;

      return new EvaluacionTrabajadorResponseDto({
        id: evaluacion.id,
        trabajadorId: evaluacion.trabajadorId,
        evaluadorId: evaluacion.evaluadorId,
        periodo: evaluacion.periodo,
        puntualidad: evaluacion.puntualidad || undefined,
        calidadTrabajo: evaluacion.calidadTrabajo || undefined,
        actitud: evaluacion.actitud || undefined,
        colaboracion: evaluacion.colaboracion || undefined,
        puntajeTotal: evaluacion.puntajeTotal || undefined,
        comentarios: evaluacion.comentarios || undefined,
        fechaEvaluacion: evaluacion.fechaEvaluacion,
        createdAt: evaluacion.createdAt!,
        trabajador: evaluacion.trabajador ? {
          id: evaluacion.trabajador.id,
          codigoEmpleado: evaluacion.trabajador.codigoEmpleado,
          cargo: evaluacion.trabajador.cargo,
          departamento: evaluacion.trabajador.departamento,
        } : undefined,
        evaluador: evaluadoresMap[evaluacion.evaluadorId] ? {
          id: evaluadoresMap[evaluacion.evaluadorId].id,
          nombre: evaluadoresMap[evaluacion.evaluadorId].nombre,
          apellidos: evaluadoresMap[evaluacion.evaluadorId].apellidos,
          email: evaluadoresMap[evaluacion.evaluadorId].email,
        } : undefined,
        promedioCalificaciones,
      });
    });
  }
}
