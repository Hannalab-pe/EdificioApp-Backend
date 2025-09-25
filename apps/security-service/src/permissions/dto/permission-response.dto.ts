export class PermissionResponseDto {
  id: number;
  modulo: string;
  accion: string;
  recurso?: string;
  descripcion?: string;
  activo: boolean;
  createdAt: Date;
}