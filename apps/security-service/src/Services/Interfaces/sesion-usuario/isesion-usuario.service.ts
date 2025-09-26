import { SesionUsuario } from '../../../entities/SesionUsuario';

export interface CreateSesionUsuarioDto {
  usuarioId: string;
  tokenHash: string;
  dispositivo?: string;
  ipAddress?: string;
  userAgent?: string;
  expiraEn: Date;
  activa?: boolean;
}

export interface UpdateSesionUsuarioDto {
  dispositivo?: string;
  ipAddress?: string;
  userAgent?: string;
  activa?: boolean;
  expiraEn?: Date;
}

export interface SesionUsuarioQuery {
  page?: number;
  limit?: number;
  usuarioId?: string;
  activa?: boolean;
  dispositivo?: string;
  ipAddress?: string;
}

export interface ISesionUsuarioService {
  create(data: CreateSesionUsuarioDto): Promise<SesionUsuario>;
  findAll(query?: SesionUsuarioQuery): Promise<{
    sesiones: SesionUsuario[];
    total: number;
    page: number;
    totalPages: number;
  }>;
  findOne(id: string): Promise<SesionUsuario>;
  findByToken(tokenHash: string): Promise<SesionUsuario>;
  findActiveByUserId(usuarioId: string): Promise<SesionUsuario[]>;
  update(id: string, data: UpdateSesionUsuarioDto): Promise<SesionUsuario>;
  remove(id: string): Promise<void>;
  deactivateSession(id: string): Promise<void>;
  deactivateAllUserSessions(usuarioId: string): Promise<void>;
  cleanExpiredSessions(): Promise<void>;
}
