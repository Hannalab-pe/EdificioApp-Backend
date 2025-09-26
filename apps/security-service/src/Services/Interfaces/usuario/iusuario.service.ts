<<<<<<< HEAD
import { Usuario } from '../../../entities/Usuario';

export interface CreateUsuarioDto {
  documentoIdentidadId: string;
  email: string;
  passwordHash: string;
  nombre: string;
  apellidos: string;
  telefono?: string;
  rolId: string;
  activo?: boolean;
  debeCambiarPassword?: boolean;
}

export interface UpdateUsuarioDto {
  documentoIdentidadId?: string;
  email?: string;
  passwordHash?: string;
  nombre?: string;
  apellidos?: string;
  telefono?: string;
  rolId?: string;
  activo?: boolean;
  debeCambiarPassword?: boolean;
  intentosFallidos?: number;
  bloqueadoHasta?: Date;
}
=======
import {
    BaseResponseDto,
    CreateUsuarioDto,
    CreateUsuarioTrabajadorDto,
    UpdateUsuarioDto,
    UsuarioListResponseDto,
    UsuarioResponseDto,
    UsuarioTrabajadorCompositeDto,
} from '../../../dto';
>>>>>>> 872c80c6d7bf7361f9d25592c6a22381544844d2

export interface UsuarioQuery {
  page?: number;
  limit?: number;
  email?: string;
  activo?: boolean;
  rolId?: string;
  nombre?: string;
}

export interface IUsuarioService {
<<<<<<< HEAD
  create(data: CreateUsuarioDto): Promise<Usuario>;
  findAll(query?: UsuarioQuery): Promise<{
    usuarios: Usuario[];
    total: number;
    page: number;
    totalPages: number;
  }>;
  findOne(id: string): Promise<Usuario>;
  findByEmail(email: string): Promise<Usuario>;
  update(id: string, data: UpdateUsuarioDto): Promise<Usuario>;
  remove(id: string): Promise<void>;
  softDelete(id: string): Promise<void>;
  updateLastAccess(id: string): Promise<void>;
  incrementFailedAttempts(id: string): Promise<void>;
  resetFailedAttempts(id: string): Promise<void>;
  blockUser(id: string, until: Date): Promise<void>;
=======
    create(data: CreateUsuarioDto): Promise<BaseResponseDto<UsuarioResponseDto>>;
    createWithTrabajador(data: CreateUsuarioTrabajadorDto): Promise<BaseResponseDto<UsuarioTrabajadorCompositeDto>>;
    findAll(query?: UsuarioQuery): Promise<BaseResponseDto<UsuarioListResponseDto>>;
    findOne(id: string): Promise<BaseResponseDto<UsuarioResponseDto>>;
    findByEmail(email: string): Promise<BaseResponseDto<UsuarioResponseDto>>;
    update(id: string, data: UpdateUsuarioDto): Promise<BaseResponseDto<UsuarioResponseDto>>;
    remove(id: string): Promise<BaseResponseDto<null>>;
    softDelete(id: string): Promise<BaseResponseDto<null>>;
    updateLastAccess(id: string): Promise<BaseResponseDto<UsuarioResponseDto>>;
    incrementFailedAttempts(id: string): Promise<BaseResponseDto<UsuarioResponseDto>>;
    resetFailedAttempts(id: string): Promise<BaseResponseDto<UsuarioResponseDto>>;
    blockUser(id: string, until: Date): Promise<BaseResponseDto<UsuarioResponseDto>>;
>>>>>>> 872c80c6d7bf7361f9d25592c6a22381544844d2
}
