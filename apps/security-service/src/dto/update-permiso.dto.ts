import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, MaxLength } from 'class-validator';

export class UpdatePermisoDto {
  @ApiProperty({
    description: 'Módulo al que pertenece el permiso',
    example: 'usuarios',
    maxLength: 50,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  modulo?: string;

  @ApiProperty({
    description: 'Acción permitida',
    example: 'crear',
    maxLength: 50,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  accion?: string;

  @ApiProperty({
    description: 'Recurso específico (opcional)',
    example: 'perfil',
    required: false,
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  recurso?: string;

  @ApiProperty({
    description: 'Descripción detallada del permiso',
    example: 'Permite crear nuevos usuarios en el sistema',
    required: false,
  })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({
    description: 'Estado activo del permiso',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
