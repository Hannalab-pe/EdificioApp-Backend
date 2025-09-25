import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateSecurityConfigDto {
  @IsString()
  clave: string;

  @IsString()
  valor: string;

  @IsOptional()
  @IsString()
  descripcion?: string;
}