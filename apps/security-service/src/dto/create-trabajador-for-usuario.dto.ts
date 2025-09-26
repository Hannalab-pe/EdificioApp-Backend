import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateTrabajadorForUsuarioDto {
  @ApiPropertyOptional({ description: 'Codigo unico del empleado', example: 'EMP001' })
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
  @IsString()
  salario?: string;

  @ApiPropertyOptional({ description: 'Estado activo/inactivo', example: true, default: true })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
