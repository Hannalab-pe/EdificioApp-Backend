import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdatePermissionDto {
  @IsOptional()
  @IsString()
  modulo?: string;

  @IsOptional()
  @IsString()
  accion?: string;

  @IsOptional()
  @IsString()
  recurso?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}