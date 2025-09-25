import { IsString, IsOptional, IsDateString, IsBoolean, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePropietarioDto {
  @ApiProperty({ description: 'ID del usuario asociado', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  usuarioId: string;

  @ApiProperty({ description: 'Fecha de registro', example: '2024-01-01' })
  @IsDateString()
  fechaRegistro: string;

  @ApiPropertyOptional({ description: 'Estado activo/inactivo', example: true, default: true })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @ApiPropertyOptional({ description: 'Observaciones adicionales', example: 'Propietario principal' })
  @IsOptional()
  @IsString()
  observaciones?: string;

  @ApiPropertyOptional({ description: 'ID de la inmobiliaria asociada', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsOptional()
  @IsUUID()
  inmobiliariaId?: string;
}

export class UpdatePropietarioDto {
  @ApiPropertyOptional({ description: 'Fecha de registro', example: '2024-01-01' })
  @IsOptional()
  @IsDateString()
  fechaRegistro?: string;

  @ApiPropertyOptional({ description: 'Estado activo/inactivo', example: true })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @ApiPropertyOptional({ description: 'Observaciones adicionales', example: 'Propietario principal' })
  @IsOptional()
  @IsString()
  observaciones?: string;

  @ApiPropertyOptional({ description: 'ID de la inmobiliaria asociada', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsOptional()
  @IsUUID()
  inmobiliariaId?: string;
}

export class PropietarioResponseDto {
  @ApiProperty({ description: 'ID único del propietario', example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ description: 'ID del usuario asociado', example: '123e4567-e89b-12d3-a456-426614174000' })
  usuarioId: string;

  @ApiProperty({ description: 'Fecha de registro', example: '2024-01-01' })
  fechaRegistro: string;

  @ApiProperty({ description: 'Estado activo/inactivo', example: true })
  activo: boolean;

  @ApiPropertyOptional({ description: 'Observaciones adicionales', example: 'Propietario principal' })
  observaciones?: string;

  @ApiProperty({ description: 'Fecha de creación' })
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización' })
  updatedAt: Date;

  @ApiPropertyOptional({ description: 'Información de la inmobiliaria asociada' })
  inmobiliaria?: {
    id: string;
    nombre: string;
    ruc?: string;
  };
}