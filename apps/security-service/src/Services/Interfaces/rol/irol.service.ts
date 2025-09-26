import { Rol, NivelAcceso } from '../../../entities/Rol';

export interface CreateRolDto {
  nombre: string;
  descripcion?: string;
  nivelAcceso: NivelAcceso;
  activo?: boolean;
}

export interface UpdateRolDto {
  nombre?: string;
  descripcion?: string;
  nivelAcceso?: NivelAcceso;
  activo?: boolean;
}

export interface RolQuery {
  page?: number;
  limit?: number;
  nombre?: string;
  nivelAcceso?: NivelAcceso;
  activo?: boolean;
}

export interface IRolService {
  create(data: CreateRolDto): Promise<Rol>;
  findAll(
    query?: RolQuery,
  ): Promise<{ roles: Rol[]; total: number; page: number; totalPages: number }>;
  findOne(id: string): Promise<Rol>;
  findByName(nombre: string): Promise<Rol>;
  update(id: string, data: UpdateRolDto): Promise<Rol>;
  remove(id: string): Promise<void>;
  softDelete(id: string): Promise<void>;
  findByNivelAcceso(nivelAcceso: NivelAcceso): Promise<Rol[]>;
}
