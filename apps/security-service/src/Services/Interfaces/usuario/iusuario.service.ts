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

export interface UsuarioQuery {
    page?: number;
    limit?: number;
    email?: string;
    activo?: boolean;
    rolId?: string;
    nombre?: string;
}

export interface IUsuarioService {
    create(data: CreateUsuarioDto): Promise<Usuario>;
    findAll(query?: UsuarioQuery): Promise<{ usuarios: Usuario[], total: number, page: number, totalPages: number }>;
    findOne(id: string): Promise<Usuario>;
    findByEmail(email: string): Promise<Usuario>;
    update(id: string, data: UpdateUsuarioDto): Promise<Usuario>;
    remove(id: string): Promise<void>;
    softDelete(id: string): Promise<void>;
    updateLastAccess(id: string): Promise<void>;
    incrementFailedAttempts(id: string): Promise<void>;
    resetFailedAttempts(id: string): Promise<void>;
    blockUser(id: string, until: Date): Promise<void>;
}