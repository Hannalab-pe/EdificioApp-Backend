import {
  IsString,
  IsOptional,
  IsUUID,
  IsInt,
  Min,
  Max,
  IsDateString,
  IsNumberString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEvaluacionTrabajadorDto {
  @ApiProperty({
    description: 'ID del trabajador evaluado',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  trabajadorId: string;

  @ApiProperty({
    description: 'ID del evaluador',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  evaluadorId: string;

  @ApiProperty({
    description: 'Período de evaluación (YYYY-MM)',
    example: '2024-01',
  })
  @IsString()
  periodo: string;

  @ApiPropertyOptional({
    description: 'Puntaje de puntualidad (1-5)',
    example: 4,
    minimum: 1,
    maximum: 5,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  puntualidad?: number;

  @ApiPropertyOptional({
    description: 'Puntaje de calidad de trabajo (1-5)',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  calidadTrabajo?: number;

  @ApiPropertyOptional({
    description: 'Puntaje de actitud (1-5)',
    example: 4,
    minimum: 1,
    maximum: 5,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  actitud?: number;

  @ApiPropertyOptional({
    description: 'Puntaje de colaboración (1-5)',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  colaboracion?: number;

  @ApiPropertyOptional({
    description: 'Puntaje total calculado',
    example: '4.50',
  })
  @IsOptional()
  @IsNumberString()
  puntajeTotal?: string;

  @ApiPropertyOptional({
    description: 'Comentarios adicionales',
    example: 'Excelente desempeño durante el período',
  })
  @IsOptional()
  @IsString()
  comentarios?: string;

  @ApiProperty({ description: 'Fecha de evaluación', example: '2024-01-31' })
  @IsDateString()
  fechaEvaluacion: string;
}

export class UpdateEvaluacionTrabajadorDto {
  @ApiPropertyOptional({
    description: 'ID del evaluador',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  evaluadorId?: string;

  @ApiPropertyOptional({
    description: 'Período de evaluación (YYYY-MM)',
    example: '2024-01',
  })
  @IsOptional()
  @IsString()
  periodo?: string;

  @ApiPropertyOptional({
    description: 'Puntaje de puntualidad (1-5)',
    example: 4,
    minimum: 1,
    maximum: 5,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  puntualidad?: number;

  @ApiPropertyOptional({
    description: 'Puntaje de calidad de trabajo (1-5)',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  calidadTrabajo?: number;

  @ApiPropertyOptional({
    description: 'Puntaje de actitud (1-5)',
    example: 4,
    minimum: 1,
    maximum: 5,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  actitud?: number;

  @ApiPropertyOptional({
    description: 'Puntaje de colaboración (1-5)',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  colaboracion?: number;

  @ApiPropertyOptional({
    description: 'Puntaje total calculado',
    example: '4.50',
  })
  @IsOptional()
  @IsNumberString()
  puntajeTotal?: string;

  @ApiPropertyOptional({
    description: 'Comentarios adicionales',
    example: 'Excelente desempeño durante el período',
  })
  @IsOptional()
  @IsString()
  comentarios?: string;

  @ApiPropertyOptional({
    description: 'Fecha de evaluación',
    example: '2024-01-31',
  })
  @IsOptional()
  @IsDateString()
  fechaEvaluacion?: string;
}

export class EvaluacionTrabajadorResponseDto {
  @ApiProperty({
    description: 'ID único de la evaluación',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'ID del trabajador evaluado',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  trabajadorId: string;

  @ApiProperty({
    description: 'ID del evaluador',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  evaluadorId: string;

  @ApiProperty({
    description: 'Período de evaluación (YYYY-MM)',
    example: '2024-01',
  })
  periodo: string;

  @ApiPropertyOptional({
    description: 'Puntaje de puntualidad (1-5)',
    example: 4,
  })
  puntualidad?: number;

  @ApiPropertyOptional({
    description: 'Puntaje de calidad de trabajo (1-5)',
    example: 5,
  })
  calidadTrabajo?: number;

  @ApiPropertyOptional({ description: 'Puntaje de actitud (1-5)', example: 4 })
  actitud?: number;

  @ApiPropertyOptional({
    description: 'Puntaje de colaboración (1-5)',
    example: 5,
  })
  colaboracion?: number;

  @ApiPropertyOptional({
    description: 'Puntaje total calculado',
    example: '4.50',
  })
  puntajeTotal?: string;

  @ApiPropertyOptional({
    description: 'Comentarios adicionales',
    example: 'Excelente desempeño durante el período',
  })
  comentarios?: string;

  @ApiProperty({ description: 'Fecha de evaluación', example: '2024-01-31' })
  fechaEvaluacion: string;

  @ApiProperty({ description: 'Fecha de creación' })
  createdAt: Date;

  @ApiPropertyOptional({ description: 'Información del trabajador evaluado' })
  trabajador?: {
    id: string;
    codigoEmpleado?: string;
    cargo: string;
    departamento?: string;
  };

  @ApiPropertyOptional({
    description: 'Promedio de todas las calificaciones',
    example: 4.5,
  })
  promedioCalificaciones?: number;

  @ApiPropertyOptional({ description: 'Información del evaluador' })
  evaluador?: {
    id: string;
    nombre: string;
    apellidos: string;
    email: string;
  };

  constructor(data: Partial<EvaluacionTrabajadorResponseDto>) {
    Object.assign(this, data);
  }
}
