import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreatePermisoDto {
  @ApiProperty({
    description: 'Módulo al que pertenece el permiso',
    example: 'USUARIOS',
  })
  @IsString()
  modulo: string;

  @ApiProperty({
    description: 'Acción permitida',
    example: 'LEER',
  })
  @IsString()
  accion: string;

  @ApiProperty({
    description: 'Recurso específico (opcional)',
    example: 'USUARIO_PERFIL',
    required: false,
  })
  @IsOptional()
  @IsString()
  recurso?: string;

  @ApiProperty({
    description: 'Descripción del permiso',
    example: 'Permite leer información de usuarios',
    required: false,
  })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({
    description: 'Si el permiso está activo',
    example: true,
    default: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
