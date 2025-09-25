import { IsString, IsOptional, IsEnum, IsArray, IsNumber, IsBoolean } from 'class-validator';
import { NivelAcceso } from '../../entities/rol.entity';

export class UpdateRoleDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsEnum(NivelAcceso)
  nivelAcceso?: NivelAcceso;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  permisosIds?: number[];
}