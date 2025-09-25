import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateSecurityConfigDto {
  @IsOptional()
  @IsString()
  valor?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}