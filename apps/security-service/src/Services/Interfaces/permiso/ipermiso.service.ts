import { Permiso } from '../../../entities/Permiso';

export interface CreatePermisoDto {
  modulo: string;
  accion: string;
  recurso?: string;
  descripcion?: string;
  activo?: boolean;
}

export interface UpdatePermisoDto {
  modulo?: string;
  accion?: string;
  recurso?: string;
  descripcion?: string;
  activo?: boolean;
}

export interface PermisoQuery {
  page?: number;
  limit?: number;
  modulo?: string;
  accion?: string;
  recurso?: string;
  activo?: boolean;
}

export interface IPermisoService {
  create(data: CreatePermisoDto): Promise<Permiso>;
  findAll(query?: PermisoQuery): Promise<{
    permisos: Permiso[];
    total: number;
    page: number;
    totalPages: number;
  }>;
  findOne(id: string): Promise<Permiso>;
  findByName(modulo: string): Promise<Permiso[]>;
  update(id: string, data: UpdatePermisoDto): Promise<Permiso>;
  remove(id: string): Promise<void>;
  softDelete(id: string): Promise<void>;
}
