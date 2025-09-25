import { IsString, IsOptional, IsDateString, IsBoolean, IsUUID, IsNumberString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTrabajadorDto {
  @ApiProperty({ description: 'ID del usuario asociado', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  usuarioId: string;

  @ApiPropertyOptional({ description: 'Código único del empleado', example: 'EMP001' })
  @IsOptional()
  @IsString()
  codigoEmpleado?: string;

  @ApiProperty({ description: 'Cargo del trabajador', example: 'Conserje' })
  @IsString()
  cargo: string;

  @ApiPropertyOptional({ description: 'Departamento al que pertenece', example: 'Mantenimiento' })
  @IsOptional()
  @IsString()
  departamento?: string;

  @ApiProperty({ description: 'Fecha de ingreso', example: '2024-01-01' })
  @IsDateString()
  fechaIngreso: string;

  @ApiPropertyOptional({ description: 'Fecha de salida', example: '2024-12-31' })
  @IsOptional()
  @IsDateString()
  fechaSalida?: string;

  @ApiPropertyOptional({ description: 'Salario del trabajador', example: '1500.00' })
  @IsOptional()
  @IsNumberString()
  salario?: string;

  @ApiPropertyOptional({ description: 'Estado activo/inactivo', example: true, default: true })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}

export class UpdateTrabajadorDto {
  @ApiPropertyOptional({ description: 'Código único del empleado', example: 'EMP001' })
  @IsOptional()
  @IsString()
  codigoEmpleado?: string;

  @ApiPropertyOptional({ description: 'Cargo del trabajador', example: 'Conserje' })
  @IsOptional()
  @IsString()
  cargo?: string;

  @ApiPropertyOptional({ description: 'Departamento al que pertenece', example: 'Mantenimiento' })
  @IsOptional()
  @IsString()
  departamento?: string;

  @ApiPropertyOptional({ description: 'Fecha de ingreso', example: '2024-01-01' })
  @IsOptional()
  @IsDateString()
  fechaIngreso?: string;

  @ApiPropertyOptional({ description: 'Fecha de salida', example: '2024-12-31' })
  @IsOptional()
  @IsDateString()
  fechaSalida?: string;

  @ApiPropertyOptional({ description: 'Salario del trabajador', example: '1500.00' })
  @IsOptional()
  @IsNumberString()
  salario?: string;

  @ApiPropertyOptional({ description: 'Estado activo/inactivo', example: true })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}

export class TrabajadorResponseDto {
  @ApiProperty({ description: 'ID único del trabajador', example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ description: 'ID del usuario asociado', example: '123e4567-e89b-12d3-a456-426614174000' })
  usuarioId: string;

  @ApiPropertyOptional({ description: 'Código único del empleado', example: 'EMP001' })
  codigoEmpleado?: string;

  @ApiProperty({ description: 'Cargo del trabajador', example: 'Conserje' })
  cargo: string;

  @ApiPropertyOptional({ description: 'Departamento al que pertenece', example: 'Mantenimiento' })
  departamento?: string;

  @ApiProperty({ description: 'Fecha de ingreso', example: '2024-01-01' })
  fechaIngreso: string;

  @ApiPropertyOptional({ description: 'Fecha de salida', example: '2024-12-31' })
  fechaSalida?: string;

  @ApiPropertyOptional({ description: 'Salario del trabajador', example: '1500.00' })
  salario?: string;

  @ApiProperty({ description: 'Estado activo/inactivo', example: true })
  activo: boolean;

  @ApiProperty({ description: 'Fecha de creación' })
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización' })
  updatedAt: Date;

  @ApiPropertyOptional({ description: 'Número total de contratos', example: 2 })
  totalContratos?: number;

  @ApiPropertyOptional({ description: 'Número total de evaluaciones', example: 3 })
  totalEvaluaciones?: number;
}