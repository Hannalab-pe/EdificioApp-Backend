import { NivelAcceso } from '../../entities/rol.entity';

export class PermissionDto {
  id: number;
  modulo: string;
  accion: string;
  recurso?: string;
  descripcion?: string;
  activo: boolean;
}

export class RoleWithPermissionsResponseDto {
  id: number;
  nombre: string;
  descripcion?: string;
  nivelAcceso: NivelAcceso;
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
  permisos: PermissionDto[];
}