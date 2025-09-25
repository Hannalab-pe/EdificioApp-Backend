import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { AuditoriaAcceso } from '../entities/auditoria-acceso.entity';
import { AuditLogResponseDto } from './dto/audit-log-response.dto';
import { AuditLogFiltersDto } from './dto/audit-log-filters.dto';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditoriaAcceso)
    private auditoriaRepository: Repository<AuditoriaAcceso>,
  ) {}

  async createLog(logData: {
    usuarioId?: number;
    accion: string;
    recurso?: string;
    detalles?: any;
    ipAddress?: string;
    userAgent?: string;
    exitoso: boolean;
  }): Promise<AuditoriaAcceso> {
    const log = this.auditoriaRepository.create({
      ...logData,
      timestamp: new Date(),
    });

    return await this.auditoriaRepository.save(log);
  }

  async findAll(filters: AuditLogFiltersDto = {}, page: number = 1, limit: number = 50): Promise<{
    data: AuditLogResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const queryBuilder = this.auditoriaRepository
      .createQueryBuilder('audit')
      .leftJoinAndSelect('audit.usuario', 'usuario')
      .orderBy('audit.timestamp', 'DESC');

    // Aplicar filtros
    this.applyFilters(queryBuilder, filters);

    // Paginación
    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    const [auditorias, total] = await queryBuilder.getManyAndCount();

    const totalPages = Math.ceil(total / limit);

    return {
      data: auditorias.map(audit => this.mapToAuditResponse(audit)),
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(id: number): Promise<AuditLogResponseDto> {
    const auditoria = await this.auditoriaRepository.findOne({
      where: { id },
      relations: ['usuario'],
    });

    if (!auditoria) {
      throw new Error('Registro de auditoría no encontrado');
    }

    return this.mapToAuditResponse(auditoria);
  }

  async findByUser(usuarioId: number, page: number = 1, limit: number = 50): Promise<{
    data: AuditLogResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const [auditorias, total] = await this.auditoriaRepository.findAndCount({
      where: { usuarioId },
      relations: ['usuario'],
      order: { timestamp: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data: auditorias.map(audit => this.mapToAuditResponse(audit)),
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findByAction(accion: string, page: number = 1, limit: number = 50): Promise<{
    data: AuditLogResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const [auditorias, total] = await this.auditoriaRepository.findAndCount({
      where: { accion },
      relations: ['usuario'],
      order: { timestamp: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data: auditorias.map(audit => this.mapToAuditResponse(audit)),
      total,
      page,
      limit,
      totalPages,
    };
  }

  async getAuditStats(): Promise<{
    totalLogs: number;
    successfulActions: number;
    failedActions: number;
    uniqueUsers: number;
    recentActivity: AuditLogResponseDto[];
  }> {
    const totalLogs = await this.auditoriaRepository.count();

    const successfulActions = await this.auditoriaRepository.count({
      where: { exitoso: true },
    });

    const failedActions = await this.auditoriaRepository.count({
      where: { exitoso: false },
    });

    const uniqueUsers = await this.auditoriaRepository
      .createQueryBuilder('audit')
      .select('COUNT(DISTINCT audit.usuarioId)', 'count')
      .where('audit.usuarioId IS NOT NULL')
      .getRawOne();

    const recentActivity = await this.auditoriaRepository.find({
      relations: ['usuario'],
      order: { timestamp: 'DESC' },
      take: 10,
    });

    return {
      totalLogs,
      successfulActions,
      failedActions,
      uniqueUsers: parseInt(uniqueUsers.count) || 0,
      recentActivity: recentActivity.map(audit => this.mapToAuditResponse(audit)),
    };
  }

  private applyFilters(
    queryBuilder: SelectQueryBuilder<AuditoriaAcceso>,
    filters: AuditLogFiltersDto,
  ): void {
    if (filters.usuarioId) {
      queryBuilder.andWhere('audit.usuarioId = :usuarioId', { usuarioId: filters.usuarioId });
    }

    if (filters.accion) {
      queryBuilder.andWhere('audit.accion = :accion', { accion: filters.accion });
    }

    if (filters.recurso) {
      queryBuilder.andWhere('audit.recurso = :recurso', { recurso: filters.recurso });
    }

    if (filters.fechaDesde) {
      queryBuilder.andWhere('audit.timestamp >= :fechaDesde', {
        fechaDesde: new Date(filters.fechaDesde),
      });
    }

    if (filters.fechaHasta) {
      queryBuilder.andWhere('audit.timestamp <= :fechaHasta', {
        fechaHasta: new Date(filters.fechaHasta),
      });
    }

    if (filters.exitoso !== undefined) {
      queryBuilder.andWhere('audit.exitoso = :exitoso', { exitoso: filters.exitoso });
    }

    if (filters.ipAddress) {
      queryBuilder.andWhere('audit.ipAddress = :ipAddress', { ipAddress: filters.ipAddress });
    }
  }

  private mapToAuditResponse(auditoria: AuditoriaAcceso): AuditLogResponseDto {
    return {
      id: auditoria.id,
      usuarioId: auditoria.usuarioId,
      usuario: auditoria.usuario ? {
        id: auditoria.usuario.id,
        nombre: auditoria.usuario.nombre,
        email: auditoria.usuario.email,
      } : undefined,
      accion: auditoria.accion,
      recurso: auditoria.recurso,
      detalles: auditoria.detalles,
      ipAddress: auditoria.ipAddress,
      userAgent: auditoria.userAgent,
      exitoso: auditoria.exitoso,
      timestamp: auditoria.timestamp,
    };
  }
}