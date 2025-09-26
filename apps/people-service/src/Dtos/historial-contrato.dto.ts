import {
  IsString,
  IsOptional,
  IsDateString,
  IsUUID,
  IsEnum,
  IsObject,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ACCION_CONTRATO } from '../Enum/contrato.enum';

export class CreateHistorialContratoDto {
  @ApiProperty({
    description: 'Acción realizada sobre el contrato',
    enum: ACCION_CONTRATO,
    example: ACCION_CONTRATO.ACCION_MODIFICADO,
  })
  @IsEnum(ACCION_CONTRATO)
  accion: ACCION_CONTRATO;

  @ApiProperty({
    description: 'Fecha en que se realizó la acción',
    example: '2024-01-15',
  })
  @IsDateString()
  fechaAccion: string;

  @ApiPropertyOptional({
    description: 'Motivo de la acción',
    example: 'Aumento salarial',
  })
  @IsOptional()
  @IsString()
  motivo?: string;

  @ApiPropertyOptional({
    description: 'Detalles adicionales en formato JSON',
    example: { salarioAnterior: '1200.00', salarioNuevo: '1500.00' },
  })
  @IsOptional()
  @IsObject()
  detalles?: object;

  @ApiPropertyOptional({
    description: 'ID del usuario responsable de la acción',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  usuarioResponsableId?: string;

  @ApiProperty({
    description: 'ID del contrato',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  contratoId: string;
}

export class UpdateHistorialContratoDto {
  @ApiPropertyOptional({
    description: 'Acción realizada sobre el contrato',
    enum: ACCION_CONTRATO,
  })
  @IsOptional()
  @IsEnum(ACCION_CONTRATO)
  accion?: ACCION_CONTRATO;

  @ApiPropertyOptional({
    description: 'Fecha en que se realizó la acción',
    example: '2024-01-15',
  })
  @IsOptional()
  @IsDateString()
  fechaAccion?: string;

  @ApiPropertyOptional({
    description: 'Motivo de la acción',
    example: 'Aumento salarial',
  })
  @IsOptional()
  @IsString()
  motivo?: string;

  @ApiPropertyOptional({
    description: 'Detalles adicionales en formato JSON',
    example: { salarioAnterior: '1200.00', salarioNuevo: '1500.00' },
  })
  @IsOptional()
  @IsObject()
  detalles?: object;

  @ApiPropertyOptional({
    description: 'ID del usuario responsable de la acción',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  usuarioResponsableId?: string;
}

export class HistorialContratoResponseDto {
  @ApiProperty({
    description: 'ID único del registro de historial',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Acción realizada sobre el contrato',
    enum: ACCION_CONTRATO,
  })
  accion: ACCION_CONTRATO;

  @ApiProperty({
    description: 'Fecha en que se realizó la acción',
    example: '2024-01-15',
  })
  fechaAccion: string;

  @ApiPropertyOptional({
    description: 'Motivo de la acción',
    example: 'Aumento salarial',
  })
  motivo?: string;

  @ApiPropertyOptional({
    description: 'Detalles adicionales en formato JSON',
    example: { salarioAnterior: '1200.00', salarioNuevo: '1500.00' },
  })
  detalles?: object;

  @ApiPropertyOptional({
    description: 'ID del usuario responsable de la acción',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  usuarioResponsableId?: string;

  @ApiProperty({ description: 'Fecha de creación del registro' })
  createdAt: Date;

  @ApiPropertyOptional({ description: 'Información básica del contrato' })
  contrato?: {
    id: string;
    fechaInicio: string;
    fechaFin?: string;
    estado: string;
  };
}
