export class AuditLogResponseDto {
  id: number;
  usuarioId?: number;
  usuario?: {
    id: number;
    nombre: string;
    email: string;
  };
  accion: string;
  recurso?: string;
  detalles?: any;
  ipAddress?: string;
  userAgent?: string;
  exitoso: boolean;
  timestamp: Date;
}