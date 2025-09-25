import { IsString, IsOptional, IsDateString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateHistorialResidenciaDto {
  @ApiProperty({ description: 'ID del usuario asociado', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  usuarioId: string;

  @ApiProperty({ description: 'Dirección completa de la residencia', example: 'Av. Libertadores 456, Dpto. 302' })
  @IsString()
  direccion: string;

  @ApiPropertyOptional({ description: 'Ciudad de la residencia', example: 'Lima' })
  @IsOptional()
  @IsString()
  ciudad?: string;

  @ApiPropertyOptional({ description: 'Fecha de inicio de residencia', example: '2024-01-01' })
  @IsOptional()
  @IsDateString()
  fechaInicio?: string;

  @ApiPropertyOptional({ description: 'Fecha de fin de residencia', example: '2024-12-31' })
  @IsOptional()
  @IsDateString()
  fechaFin?: string;

  @ApiPropertyOptional({ description: 'Motivo del cambio de residencia', example: 'Mudanza por trabajo' })
  @IsOptional()
  @IsString()
  motivoCambio?: string;
}

export class UpdateHistorialResidenciaDto {
  @ApiPropertyOptional({ description: 'Dirección completa de la residencia', example: 'Av. Libertadores 456, Dpto. 302' })
  @IsOptional()
  @IsString()
  direccion?: string;

  @ApiPropertyOptional({ description: 'Ciudad de la residencia', example: 'Lima' })
  @IsOptional()
  @IsString()
  ciudad?: string;

  @ApiPropertyOptional({ description: 'Fecha de inicio de residencia', example: '2024-01-01' })
  @IsOptional()
  @IsDateString()
  fechaInicio?: string;

  @ApiPropertyOptional({ description: 'Fecha de fin de residencia', example: '2024-12-31' })
  @IsOptional()
  @IsDateString()
  fechaFin?: string;

  @ApiPropertyOptional({ description: 'Motivo del cambio de residencia', example: 'Mudanza por trabajo' })
  @IsOptional()
  @IsString()
  motivoCambio?: string;
}

export class HistorialResidenciaResponseDto {
  @ApiProperty({ description: 'ID único del historial de residencia', example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ description: 'ID del usuario asociado', example: '123e4567-e89b-12d3-a456-426614174000' })
  usuarioId: string;

  @ApiProperty({ description: 'Dirección completa de la residencia', example: 'Av. Libertadores 456, Dpto. 302' })
  direccion: string;

  @ApiPropertyOptional({ description: 'Ciudad de la residencia', example: 'Lima' })
  ciudad?: string;

  @ApiPropertyOptional({ description: 'Fecha de inicio de residencia', example: '2024-01-01' })
  fechaInicio?: string;

  @ApiPropertyOptional({ description: 'Fecha de fin de residencia', example: '2024-12-31' })
  fechaFin?: string;

  @ApiPropertyOptional({ description: 'Motivo del cambio de residencia', example: 'Mudanza por trabajo' })
  motivoCambio?: string;

  @ApiProperty({ description: 'Fecha de creación del registro' })
  createdAt: Date;

  @ApiPropertyOptional({ description: 'Duración de residencia en días', example: 365 })
  duracionDias?: number;

  @ApiPropertyOptional({ description: 'Indica si es la residencia actual', example: true })
  esResidenciaActual?: boolean;
}