import {
  IsString,
  IsOptional,
  IsDateString,
  IsBoolean,
  IsUUID,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TipoResidente } from '../Enum/residente.enum';

export class CreateResidenteDto {
  @ApiProperty({
    description: 'ID del usuario asociado',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  usuarioId: string;

  @ApiProperty({
    description: 'Tipo de residente',
    enum: TipoResidente,
    example: TipoResidente.PROPIETARIO,
  })
  @IsEnum(TipoResidente)
  tipoResidente: TipoResidente;

  @ApiProperty({ description: 'Fecha de ingreso', example: '2024-01-01' })
  @IsDateString()
  fechaIngreso: string;

  @ApiPropertyOptional({
    description: 'Fecha de salida',
    example: '2024-12-31',
  })
  @IsOptional()
  @IsDateString()
  fechaSalida?: string;

  @ApiPropertyOptional({
    description: 'Estado activo/inactivo',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @ApiPropertyOptional({
    description: 'Observaciones adicionales',
    example: 'Residente permanente',
  })
  @IsOptional()
  @IsString()
  observaciones?: string;
}

export class UpdateResidenteDto {
  @ApiPropertyOptional({
    description: 'Tipo de residente',
    enum: TipoResidente,
  })
  @IsOptional()
  @IsEnum(TipoResidente)
  tipoResidente?: TipoResidente;

  @ApiPropertyOptional({
    description: 'Fecha de ingreso',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsDateString()
  fechaIngreso?: string;

  @ApiPropertyOptional({
    description: 'Fecha de salida',
    example: '2024-12-31',
  })
  @IsOptional()
  @IsDateString()
  fechaSalida?: string;

  @ApiPropertyOptional({ description: 'Estado activo/inactivo', example: true })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @ApiPropertyOptional({
    description: 'Observaciones adicionales',
    example: 'Residente permanente',
  })
  @IsOptional()
  @IsString()
  observaciones?: string;
}

export class ResidenteResponseDto {
  @ApiProperty({
    description: 'ID único del residente',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'ID del usuario asociado',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  usuarioId: string;

  @ApiProperty({ description: 'Tipo de residente', enum: TipoResidente })
  tipoResidente: TipoResidente;

  @ApiProperty({ description: 'Fecha de ingreso', example: '2024-01-01' })
  fechaIngreso: string;

  @ApiPropertyOptional({
    description: 'Fecha de salida',
    example: '2024-12-31',
  })
  fechaSalida?: string;

  @ApiProperty({ description: 'Estado activo/inactivo', example: true })
  activo: boolean;

  @ApiPropertyOptional({
    description: 'Observaciones adicionales',
    example: 'Residente permanente',
  })
  observaciones?: string;

  @ApiProperty({ description: 'Fecha de creación' })
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización' })
  updatedAt: Date;
}
