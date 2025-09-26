import { RolPermiso } from '../../../entities/RolPermiso';

export interface CreateRolPermisoDto {
  rolId: string;
  permisoId: string;
  concedido?: boolean;
}

export interface UpdateRolPermisoDto {
  concedido?: boolean;
}

export interface RolPermisoQuery {
  page?: number;
  limit?: number;
  rolId?: string;
  permisoId?: string;
  concedido?: boolean;
}

export interface IRolPermisoService {
  create(data: CreateRolPermisoDto): Promise<RolPermiso>;
  findAll(query?: RolPermisoQuery): Promise<{
    rolPermisos: RolPermiso[];
    total: number;
    page: number;
    totalPages: number;
  }>;
  findOne(id: string): Promise<RolPermiso>;
  findByRolId(rolId: string): Promise<RolPermiso[]>;
  findByPermisoId(permisoId: string): Promise<RolPermiso[]>;
  update(id: string, data: UpdateRolPermisoDto): Promise<RolPermiso>;
  remove(id: string): Promise<void>;
  removeByRolAndPermiso(rolId: string, permisoId: string): Promise<void>;
}
