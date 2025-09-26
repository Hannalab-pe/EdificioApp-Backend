import { Rol, NivelAcceso } from '../../../entities/Rol';
import {
  CreateRolDto,
  UpdateRolDto,
  RolResponseDto,
  RolListResponseDto,
} from '../../../dto';

// Re-exportar los DTOs para compatibilidad
export { CreateRolDto, UpdateRolDto, RolResponseDto, RolListResponseDto };

export interface RolQuery {
  page?: number;
  limit?: number;
  nombre?: string;
  nivelAcceso?: NivelAcceso;
  activo?: boolean;
}

export interface IRolService {
  create(data: CreateRolDto): Promise<RolResponseDto>;
  findAll(query?: RolQuery): Promise<RolListResponseDto>;
  findOne(id: string): Promise<RolResponseDto>;
  findByName(nombre: string): Promise<RolResponseDto>;
  update(id: string, data: UpdateRolDto): Promise<RolResponseDto>;
  remove(id: string): Promise<void>;
  softDelete(id: string): Promise<void>;
  findByNivelAcceso(nivelAcceso: NivelAcceso): Promise<RolResponseDto[]>;
}
