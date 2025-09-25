import { IsOptional, IsString, IsNumber, IsDateString, IsBoolean } from 'class-validator';

export class AuditLogFiltersDto {
  @IsOptional()
  @IsNumber()
  usuarioId?: number;

  @IsOptional()
  @IsString()
  accion?: string;

  @IsOptional()
  @IsString()
  recurso?: string;

  @IsOptional()
  @IsDateString()
  fechaDesde?: string;

  @IsOptional()
  @IsDateString()
  fechaHasta?: string;

  @IsOptional()
  @IsBoolean()
  exitoso?: boolean;

  @IsOptional()
  @IsString()
  ipAddress?: string;
}