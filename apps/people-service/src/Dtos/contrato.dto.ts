import { IsString, IsOptional, IsDateString, IsUUID, IsNumberString, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ESTADO_CONTRATO } from '../Enum/contrato.enum';


export class CreateContratoDto {
  @ApiProperty({ description: 'Fecha de inicio del contrato', example: '2024-01-01' })
  @IsDateString()
  fechaInicio: string;

  @ApiPropertyOptional({ description: 'Fecha de fin del contrato', example: '2024-12-31' })
  @IsOptional()
  @IsDateString()
  fechaFin?: string;

  @ApiProperty({ description: 'Salario establecido en el contrato', example: '1500.00' })
  @IsNumberString()
  salario: string;

  @ApiPropertyOptional({ description: 'Descripción del cargo', example: 'Responsable del mantenimiento general del edificio' })
  @IsOptional()
  @IsString()
  descripcionCargo?: string;

  @ApiPropertyOptional({ description: 'Estado del contrato', enum: ESTADO_CONTRATO, default: ESTADO_CONTRATO.ESTADO_VIGENTE })
  @IsOptional()
  @IsEnum(ESTADO_CONTRATO)
  estado?: ESTADO_CONTRATO;

  @ApiPropertyOptional({ description: 'URL del archivo del contrato', example: 'https://example.com/contrato.pdf' })
  @IsOptional()
  @IsString()
  archivoContratoUrl?: string;

  @ApiProperty({ description: 'ID del tipo de contrato', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  tipoContratoId: string;

  @ApiProperty({ description: 'ID del trabajador', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  trabajadorId: string;
}

export class UpdateContratoDto {
  @ApiPropertyOptional({ description: 'Fecha de inicio del contrato', example: '2024-01-01' })
  @IsOptional()
  @IsDateString()
  fechaInicio?: string;

  @ApiPropertyOptional({ description: 'Fecha de fin del contrato', example: '2024-12-31' })
  @IsOptional()
  @IsDateString()
  fechaFin?: string;

  @ApiPropertyOptional({ description: 'Salario establecido en el contrato', example: '1500.00' })
  @IsOptional()
  @IsNumberString()
  salario?: string;

  @ApiPropertyOptional({ description: 'Descripción del cargo', example: 'Responsable del mantenimiento general del edificio' })
  @IsOptional()
  @IsString()
  descripcionCargo?: string;

  @ApiPropertyOptional({ description: 'Estado del contrato', enum: ESTADO_CONTRATO })
  @IsOptional()
  @IsEnum(ESTADO_CONTRATO)
  estado?: ESTADO_CONTRATO;

  @ApiPropertyOptional({ description: 'URL del archivo del contrato', example: 'https://example.com/contrato.pdf' })
  @IsOptional()
  @IsString()
  archivoContratoUrl?: string;

  @ApiPropertyOptional({ description: 'ID del tipo de contrato', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsOptional()
  @IsUUID()
  tipoContratoId?: string;

  @ApiPropertyOptional({ description: 'ID del trabajador', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsOptional()
  @IsUUID()
  trabajadorId?: string;
}

export class ContratoResponseDto {
  @ApiProperty({ description: 'ID único del contrato', example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ description: 'Fecha de inicio del contrato', example: '2024-01-01' })
  fechaInicio: string;

  @ApiPropertyOptional({ description: 'Fecha de fin del contrato', example: '2024-12-31' })
  fechaFin?: string;

  @ApiProperty({ description: 'Salario establecido en el contrato', example: '1500.00' })
  salario: string;

  @ApiPropertyOptional({ description: 'Descripción del cargo', example: 'Responsable del mantenimiento general del edificio' })
  descripcionCargo?: string;

  @ApiProperty({ description: 'Estado del contrato', enum: ESTADO_CONTRATO })
  estado: ESTADO_CONTRATO;

  @ApiPropertyOptional({ description: 'URL del archivo del contrato', example: 'https://example.com/contrato.pdf' })
  archivoContratoUrl?: string;

  @ApiProperty({ description: 'Fecha de creación' })
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización' })
  updatedAt: Date;

  @ApiPropertyOptional({ description: 'Información del tipo de contrato' })
  tipoContrato?: {
    id: string;
    nombre: string;
    descripcion?: string;
    duracionDefaultMeses?: number;
    renovable?: boolean;
  };

  @ApiPropertyOptional({ description: 'Información del trabajador' })
  trabajador?: {
    id: string;
    codigoEmpleado?: string;
    cargo: string;
    departamento?: string;
  };

  @ApiPropertyOptional({ description: 'Número de cambios en el historial', example: 2 })
  totalCambiosHistorial?: number;
}