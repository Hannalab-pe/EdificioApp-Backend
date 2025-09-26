import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { AuditoriaAcceso } from '../../../entities/AuditoriaAcceso';
import {
  IAuditoriaAccesoService,
  CreateAuditoriaAccesoDto,
  AuditoriaAccesoQuery,
} from '../../Interfaces/auditoria-acceso/iauditoria-acceso.service';

@Injectable()
export class AuditoriaAccesoService implements IAuditoriaAccesoService {
  constructor(
    @InjectRepository(AuditoriaAcceso)
    private readonly auditoriaRepository: Repository<AuditoriaAcceso>,
  ) {}

  async create(data: CreateAuditoriaAccesoDto): Promise<AuditoriaAcceso> {
    const auditoria = this.auditoriaRepository.create(data);
    return await this.auditoriaRepository.save(auditoria);
  }

  async findAll(query: AuditoriaAccesoQuery = {}): Promise<{
    auditorias: AuditoriaAcceso[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const {
      page = 1,
      limit = 10,
      usuarioId,
      accion,
      recurso,
      exitoso,
      ipAddress,
      fechaDesde,
      fechaHasta,
    } = query;

    const queryBuilder = this.auditoriaRepository
      .createQueryBuilder('auditoria')
      .leftJoinAndSelect('auditoria.usuario', 'usuario');

    // Filtros
    if (usuarioId) {
      queryBuilder.andWhere('auditoria.usuarioId = :usuarioId', { usuarioId });
    }

    if (accion) {
      queryBuilder.andWhere('auditoria.accion ILIKE :accion', {
        accion: `%${accion}%`,
      });
    }

    if (recurso) {
      queryBuilder.andWhere('auditoria.recurso ILIKE :recurso', {
        recurso: `%${recurso}%`,
      });
    }

    if (exitoso !== undefined) {
      queryBuilder.andWhere('auditoria.exitoso = :exitoso', { exitoso });
    }

    if (ipAddress) {
      queryBuilder.andWhere('auditoria.ipAddress = :ipAddress', { ipAddress });
    }

    if (fechaDesde && fechaHasta) {
      queryBuilder.andWhere(
        'auditoria.timestamp BETWEEN :fechaDesde AND :fechaHasta',
        {
          fechaDesde,
          fechaHasta,
        },
      );
    } else if (fechaDesde) {
      queryBuilder.andWhere('auditoria.timestamp >= :fechaDesde', {
        fechaDesde,
      });
    } else if (fechaHasta) {
      queryBuilder.andWhere('auditoria.timestamp <= :fechaHasta', {
        fechaHasta,
      });
    }

    // Paginación
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    // Ordenamiento
    queryBuilder.orderBy('auditoria.timestamp', 'DESC');

    const [auditorias, total] = await queryBuilder.getManyAndCount();
    const totalPages = Math.ceil(total / limit);

    return {
      auditorias,
      total,
      page,
      totalPages,
    };
  }

  async findOne(id: string): Promise<AuditoriaAcceso> {
    const auditoria = await this.auditoriaRepository.findOne({
      where: { id },
      relations: ['usuario'],
    });

    if (!auditoria) {
      throw new NotFoundException('Registro de auditoría no encontrado');
    }

    return auditoria;
  }

  async findByUserId(usuarioId: string): Promise<AuditoriaAcceso[]> {
    return await this.auditoriaRepository.find({
      where: { usuarioId },
      order: { timestamp: 'DESC' },
      take: 100, // Limitar a los últimos 100 registros
    });
  }

  async findByAction(accion: string): Promise<AuditoriaAcceso[]> {
    return await this.auditoriaRepository.find({
      where: { accion },
      relations: ['usuario'],
      order: { timestamp: 'DESC' },
      take: 100,
    });
  }

  async getSecurityReport(fechaDesde?: Date, fechaHasta?: Date): Promise<any> {
    let whereClause = {};

    if (fechaDesde && fechaHasta) {
      whereClause = {
        timestamp: Between(fechaDesde, fechaHasta),
      };
    }

    const totalAccesos = await this.auditoriaRepository.count({
      where: whereClause,
    });
    const accesosExitosos = await this.auditoriaRepository.count({
      where: { ...whereClause, exitoso: true },
    });
    const accesosFallidos = await this.auditoriaRepository.count({
      where: { ...whereClause, exitoso: false },
    });

    // Top acciones más comunes
    const topAcciones = await this.auditoriaRepository
      .createQueryBuilder('auditoria')
      .select('auditoria.accion', 'accion')
      .addSelect('COUNT(*)', 'total')
      .where(
        fechaDesde && fechaHasta
          ? 'auditoria.timestamp BETWEEN :fechaDesde AND :fechaHasta'
          : '1=1',
        {
          fechaDesde,
          fechaHasta,
        },
      )
      .groupBy('auditoria.accion')
      .orderBy('total', 'DESC')
      .limit(10)
      .getRawMany();

    // IPs más activas
    const topIPs = await this.auditoriaRepository
      .createQueryBuilder('auditoria')
      .select('auditoria.ipAddress', 'ip')
      .addSelect('COUNT(*)', 'total')
      .where('auditoria.ipAddress IS NOT NULL')
      .andWhere(
        fechaDesde && fechaHasta
          ? 'auditoria.timestamp BETWEEN :fechaDesde AND :fechaHasta'
          : '1=1',
        {
          fechaDesde,
          fechaHasta,
        },
      )
      .groupBy('auditoria.ipAddress')
      .orderBy('total', 'DESC')
      .limit(10)
      .getRawMany();

    return {
      totalAccesos,
      accesosExitosos,
      accesosFallidos,
      tasaExito:
        totalAccesos > 0
          ? ((accesosExitosos / totalAccesos) * 100).toFixed(2)
          : 0,
      topAcciones,
      topIPs,
      periodo: {
        desde: fechaDesde || 'Sin filtro',
        hasta: fechaHasta || 'Sin filtro',
      },
    };
  }

  async remove(id: string): Promise<void> {
    const auditoria = await this.findOne(id);
    await this.auditoriaRepository.remove(auditoria);
  }
}
