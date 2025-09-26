import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTipoContratoDto {
  @ApiProperty({
    description: 'Nombre del tipo de contrato',
    example: 'Contrato de Trabajo a Plazo Fijo',
  })
  @IsString()
  nombre: string;

  @ApiPropertyOptional({
    description: 'Descripción detallada del tipo de contrato',
    example: 'Contrato para empleados temporales con duración específica',
  })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiPropertyOptional({
    description: 'Duración por defecto en meses',
    example: 12,
    minimum: 1,
    maximum: 120,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(120)
  duracionDefaultMeses?: number;

  @ApiPropertyOptional({
    description: 'Indica si el contrato es renovable',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  renovable?: boolean;

  @ApiPropertyOptional({
    description: 'Estado activo/inactivo',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}

export class UpdateTipoContratoDto {
  @ApiPropertyOptional({
    description: 'Nombre del tipo de contrato',
    example: 'Contrato de Trabajo a Plazo Fijo',
  })
  @IsOptional()
  @IsString()
  nombre?: string;

  @ApiPropertyOptional({
    description: 'Descripción detallada del tipo de contrato',
    example: 'Contrato para empleados temporales con duración específica',
  })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiPropertyOptional({
    description: 'Duración por defecto en meses',
    example: 12,
    minimum: 1,
    maximum: 120,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(120)
  duracionDefaultMeses?: number;

  @ApiPropertyOptional({
    description: 'Indica si el contrato es renovable',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  renovable?: boolean;

  @ApiPropertyOptional({ description: 'Estado activo/inactivo', example: true })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}

export class TipoContratoResponseDto {
  @ApiProperty({
    description: 'ID único del tipo de contrato',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Nombre del tipo de contrato',
    example: 'Contrato de Trabajo a Plazo Fijo',
  })
  nombre: string;

  @ApiPropertyOptional({
    description: 'Descripción detallada del tipo de contrato',
    example: 'Contrato para empleados temporales con duración específica',
  })
  descripcion?: string;

  @ApiPropertyOptional({
    description: 'Duración por defecto en meses',
    example: 12,
  })
  duracionDefaultMeses?: number;

  @ApiProperty({
    description: 'Indica si el contrato es renovable',
    example: true,
  })
  renovable: boolean;

  @ApiProperty({ description: 'Estado activo/inactivo', example: true })
  activo: boolean;

  @ApiProperty({ description: 'Fecha de creación' })
  createdAt: Date;

  @ApiPropertyOptional({
    description: 'Número total de contratos de este tipo',
    example: 5,
  })
  totalContratos?: number;
}
