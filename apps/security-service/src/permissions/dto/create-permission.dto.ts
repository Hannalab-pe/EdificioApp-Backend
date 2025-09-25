import { IsString, IsOptional } from 'class-validator';

export class CreatePermissionDto {
  @IsString()
  modulo: string;

  @IsString()
  accion: string;

  @IsOptional()
  @IsString()
  recurso?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;
}