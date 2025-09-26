import { AuditoriaAcceso } from '../../../entities/AuditoriaAcceso';

export interface CreateAuditoriaAccesoDto {
  usuarioId?: string;
  accion: string;
  recurso?: string;
  detalles?: object;
  ipAddress?: string;
  userAgent?: string;
  exitoso: boolean;
}

export interface AuditoriaAccesoQuery {
  page?: number;
  limit?: number;
  usuarioId?: string;
  accion?: string;
  recurso?: string;
  exitoso?: boolean;
  ipAddress?: string;
  fechaDesde?: Date;
  fechaHasta?: Date;
}

export interface IAuditoriaAccesoService {
  create(data: CreateAuditoriaAccesoDto): Promise<AuditoriaAcceso>;
  findAll(query?: AuditoriaAccesoQuery): Promise<{
    auditorias: AuditoriaAcceso[];
    total: number;
    page: number;
    totalPages: number;
  }>;
  findOne(id: string): Promise<AuditoriaAcceso>;
  findByUserId(usuarioId: string): Promise<AuditoriaAcceso[]>;
  findByAction(accion: string): Promise<AuditoriaAcceso[]>;
  getSecurityReport(fechaDesde?: Date, fechaHasta?: Date): Promise<any>;
  remove(id: string): Promise<void>;
}
