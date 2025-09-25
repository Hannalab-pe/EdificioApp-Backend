import { IsEmail, IsNotEmpty, IsString, IsOptional, IsBoolean, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateUserDto {
    @ApiProperty({
        description: 'Email del usuario',
        example: 'usuario@ejemplo.com'
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'Contraseña del usuario',
        example: 'password123'
    })
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiProperty({
        description: 'Nombre del usuario',
        example: 'Juan'
    })
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @ApiProperty({
        description: 'Apellidos del usuario',
        example: 'Pérez García'
    })
    @IsString()
    @IsNotEmpty()
    apellidos: string;

    @ApiPropertyOptional({
        description: 'Teléfono del usuario',
        example: '+51987654321'
    })
    @IsString()
    @IsOptional()
    telefono?: string;

    @ApiProperty({
        description: 'ID del rol del usuario',
        example: 1
    })
    @IsNumber()
    @IsNotEmpty()
    rolId: number;

    @ApiProperty({
        description: 'Tipo de documento',
        example: 'DNI',
        enum: ['DNI', 'PASAPORTE', 'CARNET_EXTRANJERIA']
    })
    @IsString()
    @IsNotEmpty()
    tipoDocumento: string;

    @ApiProperty({
        description: 'Número de documento',
        example: '12345678'
    })
    @IsString()
    @IsNotEmpty()
    numeroDocumento: string;

    @ApiPropertyOptional({
        description: 'País de emisión del documento',
        example: 'PE'
    })
    @IsString()
    @IsOptional()
    paisEmision?: string;

    @ApiPropertyOptional({
        description: 'Fecha de emisión del documento',
        example: '2020-01-15'
    })
    @IsDateString()
    @IsOptional()
    fechaEmision?: string;

    @ApiPropertyOptional({
        description: 'Fecha de vencimiento del documento',
        example: '2030-01-15'
    })
    @IsDateString()
    @IsOptional()
    fechaVencimiento?: string;
}

export class UpdateUserDto {
    @ApiPropertyOptional({
        description: 'Email del usuario',
        example: 'usuario@ejemplo.com'
    })
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiPropertyOptional({
        description: 'Nombre del usuario',
        example: 'Juan'
    })
    @IsString()
    @IsOptional()
    nombre?: string;

    @ApiPropertyOptional({
        description: 'Apellidos del usuario',
        example: 'Pérez García'
    })
    @IsString()
    @IsOptional()
    apellidos?: string;

    @ApiPropertyOptional({
        description: 'Teléfono del usuario',
        example: '+51987654321'
    })
    @IsString()
    @IsOptional()
    telefono?: string;

    @ApiPropertyOptional({
        description: 'ID del rol del usuario',
        example: 1
    })
    @IsNumber()
    @IsOptional()
    rolId?: number;

    @ApiPropertyOptional({
        description: 'Estado activo del usuario',
        example: true
    })
    @IsBoolean()
    @IsOptional()
    activo?: boolean;
}

export class RoleResponseDto {
    @ApiProperty({
        description: 'ID del rol',
        example: 1
    })
    id: number;

    @ApiProperty({
        description: 'Nombre del rol',
        example: 'ADMIN'
    })
    nombre: string;

    @ApiProperty({
        description: 'Descripción del rol',
        example: 'Administrador del sistema'
    })
    descripcion?: string;

    @ApiProperty({
        description: 'Nivel de acceso',
        example: 'ADMIN',
        enum: ['ADMIN', 'CONDOMINIO', 'RESIDENTE', 'TRABAJADOR']
    })
    nivelAcceso: string;

    @ApiProperty({
        description: 'Estado activo del rol',
        example: true
    })
    activo: boolean;
}

export class DocumentoIdentidadResponseDto {
    @ApiProperty({
        description: 'ID del documento',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    idDocumentoIdentidad: string;

    @ApiProperty({
        description: 'Tipo de documento',
        example: 'DNI',
        enum: ['DNI', 'PASAPORTE', 'CARNET_EXTRANJERIA']
    })
    tipo: string;

    @ApiProperty({
        description: 'Número de documento',
        example: '12345678'
    })
    numero: string;

    @ApiProperty({
        description: 'País de emisión',
        example: 'PE'
    })
    paisEmision: string;

    @ApiPropertyOptional({
        description: 'Fecha de emisión',
        example: '2020-01-15'
    })
    fechaEmision?: Date;

    @ApiPropertyOptional({
        description: 'Fecha de vencimiento',
        example: '2030-01-15'
    })
    fechaVencimiento?: Date;

    @ApiProperty({
        description: 'Estado de validación',
        example: true
    })
    validado: boolean;
}

export class UserResponseDto {
    @ApiProperty({
        description: 'ID del usuario',
        example: 1
    })
    id: number;

    @ApiProperty({
        description: 'Email del usuario',
        example: 'usuario@ejemplo.com'
    })
    email: string;

    @ApiProperty({
        description: 'Nombre del usuario',
        example: 'Juan'
    })
    nombre: string;

    @ApiProperty({
        description: 'Apellidos del usuario',
        example: 'Pérez García'
    })
    apellidos: string;

    @ApiPropertyOptional({
        description: 'Teléfono del usuario',
        example: '+51987654321'
    })
    telefono?: string;

    @ApiProperty({
        description: 'Estado activo del usuario',
        example: true
    })
    activo: boolean;

    @ApiProperty({
        description: 'Rol del usuario'
    })
    rol: RoleResponseDto;

    @ApiProperty({
        description: 'Documento de identidad'
    })
    documentoIdentidad: DocumentoIdentidadResponseDto;

    @ApiProperty({
        description: 'Fecha de último acceso',
        example: '2024-01-15T10:30:00Z'
    })
    ultimoAcceso?: Date;

    @ApiProperty({
        description: 'Fecha de creación',
        example: '2024-01-01T00:00:00Z'
    })
    createdAt: Date;

    @ApiProperty({
        description: 'Fecha de actualización',
        example: '2024-01-15T10:30:00Z'
    })
    updatedAt: Date;
}