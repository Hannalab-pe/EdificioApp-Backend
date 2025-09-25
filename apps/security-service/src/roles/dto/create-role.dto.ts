import { IsString, IsOptional, IsEnum, IsArray, IsNumber } from 'class-validator';
import { NivelAcceso } from '../../entities/rol.entity';

export class CreateRoleDto {
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsEnum(NivelAcceso)
  nivelAcceso: NivelAcceso;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  permisosIds?: number[];
}