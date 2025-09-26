import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsNumber, IsNotEmpty, MaxLength, Min } from 'class-validator';
import { TipoContrato } from '../entities/TipoContrato';

// =============== CREATE DTO ===============
export class CreateTipoContratoDto {
    @ApiProperty({
        description: 'Nombre único del tipo de contrato',
        example: 'Contrato Indefinido',
        maxLength: 100
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    nombre: string;

    @ApiPropertyOptional({
        description: 'Descripción detallada del tipo de contrato',
        example: 'Contrato de trabajo de duración indefinida con todas las prestaciones sociales'
    })
    @IsOptional()
    @IsString()
    descripcion?: string;

    @ApiPropertyOptional({
        description: 'Duración por defecto en meses del contrato',
        example: 12,
        minimum: 1
    })
    @IsOptional()
    @IsNumber()
    @Min(1)
    duracionDefaultMeses?: number;

    @ApiPropertyOptional({
        description: 'Indica si el contrato es renovable automáticamente',
        example: true,
        default: true
    })
    @IsOptional()
    @IsBoolean()
    renovable?: boolean;

    @ApiPropertyOptional({
        description: 'Indica si el tipo de contrato está activo',
        example: true,
        default: true
    })
    @IsOptional()
    @IsBoolean()
    activo?: boolean;
}

// =============== UPDATE DTO ===============
export class UpdateTipoContratoDto {
    @ApiPropertyOptional({
        description: 'Nombre único del tipo de contrato',
        example: 'Contrato Indefinido',
        maxLength: 100
    })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    nombre?: string;

    @ApiPropertyOptional({
        description: 'Descripción detallada del tipo de contrato',
        example: 'Contrato de trabajo de duración indefinida con todas las prestaciones sociales'
    })
    @IsOptional()
    @IsString()
    descripcion?: string;

    @ApiPropertyOptional({
        description: 'Duración por defecto en meses del contrato',
        example: 12,
        minimum: 1
    })
    @IsOptional()
    @IsNumber()
    @Min(1)
    duracionDefaultMeses?: number;

    @ApiPropertyOptional({
        description: 'Indica si el contrato es renovable automáticamente',
        example: true
    })
    @IsOptional()
    @IsBoolean()
    renovable?: boolean;

    @ApiPropertyOptional({
        description: 'Indica si el tipo de contrato está activo',
        example: true
    })
    @IsOptional()
    @IsBoolean()
    activo?: boolean;
}

// =============== RESPONSE DTO ===============
export class TipoContratoResponseDto {
    @ApiProperty({
        description: 'ID único del tipo de contrato',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    id: string;

    @ApiProperty({
        description: 'Nombre único del tipo de contrato',
        example: 'Contrato Indefinido'
    })
    nombre: string;

    @ApiPropertyOptional({
        description: 'Descripción detallada del tipo de contrato',
        example: 'Contrato de trabajo de duración indefinida con todas las prestaciones sociales'
    })
    descripcion: string | null;

    @ApiPropertyOptional({
        description: 'Duración por defecto en meses del contrato',
        example: 12
    })
    duracionDefaultMeses: number | null;

    @ApiPropertyOptional({
        description: 'Indica si el contrato es renovable automáticamente',
        example: true
    })
    renovable: boolean | null;

    @ApiPropertyOptional({
        description: 'Indica si el tipo de contrato está activo',
        example: true
    })
    activo: boolean | null;

    @ApiPropertyOptional({
        description: 'Fecha de creación del registro',
        example: '2025-09-26T10:30:00.000Z'
    })
    createdAt: Date | null;

    constructor(tipoContrato: TipoContrato) {
        this.id = tipoContrato.id;
        this.nombre = tipoContrato.nombre;
        this.descripcion = tipoContrato.descripcion;
        this.duracionDefaultMeses = tipoContrato.duracionDefaultMeses;
        this.renovable = tipoContrato.renovable;
        this.activo = tipoContrato.activo;
        this.createdAt = tipoContrato.createdAt;
    }
}