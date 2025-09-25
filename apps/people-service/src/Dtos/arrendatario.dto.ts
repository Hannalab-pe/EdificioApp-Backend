import { IsString, IsOptional, IsDateString, IsBoolean, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateArrendatarioDto {
  @ApiProperty({ description: 'ID del usuario asociado', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  usuarioId: string;

  @ApiPropertyOptional({ description: 'Tipo de negocio', example: 'Comercio' })
  @IsOptional()
  @IsString()
  tipoNegocio?: string;

  @ApiPropertyOptional({ description: 'RUC del arrendatario', example: '20123456789' })
  @IsOptional()
  @IsString()
  ruc?: string;

  @ApiProperty({ description: 'Fecha de registro', example: '2024-01-01' })
  @IsDateString()
  fechaRegistro: string;

  @ApiPropertyOptional({ description: 'Estado activo/inactivo', example: true, default: true })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @ApiPropertyOptional({ description: 'Observaciones adicionales', example: 'Buen historial de pagos' })
  @IsOptional()
  @IsString()
  observaciones?: string;
}

export class UpdateArrendatarioDto {
  @ApiPropertyOptional({ description: 'Tipo de negocio', example: 'Comercio' })
  @IsOptional()
  @IsString()
  tipoNegocio?: string;

  @ApiPropertyOptional({ description: 'RUC del arrendatario', example: '20123456789' })
  @IsOptional()
  @IsString()
  ruc?: string;

  @ApiPropertyOptional({ description: 'Fecha de registro', example: '2024-01-01' })
  @IsOptional()
  @IsDateString()
  fechaRegistro?: string;

  @ApiPropertyOptional({ description: 'Estado activo/inactivo', example: true })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @ApiPropertyOptional({ description: 'Observaciones adicionales', example: 'Buen historial de pagos' })
  @IsOptional()
  @IsString()
  observaciones?: string;
}

export class ArrendatarioResponseDto {
  @ApiProperty({ description: 'ID único del arrendatario', example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ description: 'ID del usuario asociado', example: '123e4567-e89b-12d3-a456-426614174000' })
  usuarioId: string;

  @ApiPropertyOptional({ description: 'Tipo de negocio', example: 'Comercio' })
  tipoNegocio?: string;

  @ApiPropertyOptional({ description: 'RUC del arrendatario', example: '20123456789' })
  ruc?: string;

  @ApiProperty({ description: 'Fecha de registro', example: '2024-01-01' })
  fechaRegistro: string;

  @ApiProperty({ description: 'Estado activo/inactivo', example: true })
  activo: boolean;

  @ApiPropertyOptional({ description: 'Observaciones adicionales', example: 'Buen historial de pagos' })
  observaciones?: string;

  @ApiProperty({ description: 'Fecha de creación' })
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización' })
  updatedAt: Date;
}