import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsBoolean, IsUUID, IsEnum, IsDateString, ValidateIf, IsNotEmpty } from 'class-validator';
import { TipoDocumento } from '../entities/DocumentoIdentidad';

export class CreateUsuarioWithDocumentoDto {
    // =========== DATOS DEL DOCUMENTO DE IDENTIDAD (OPCIONAL) ===========
    // Si se proporciona documentoIdentidadId, se usa ese. Si no, se crea uno nuevo.

    @ApiPropertyOptional({
        description: 'ID del documento de identidad existente (opcional, si no se proporciona se creará uno nuevo)',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsOptional()
    @IsUUID()
    documentoIdentidadId?: string;

    // =========== DATOS PARA CREAR NUEVO DOCUMENTO (SI NO EXISTE) ===========

    @ApiPropertyOptional({
        description: 'Tipo de documento de identidad (requerido si no se proporciona documentoIdentidadId)',
        example: 'DNI',
        enum: ['DNI', 'PASAPORTE', 'CE', 'RUC']
    })
    @ValidateIf(o => !o.documentoIdentidadId)
    @IsNotEmpty()
    @IsEnum(['DNI', 'PASAPORTE', 'CE', 'RUC'])
    tipoDocumento?: TipoDocumento;

    @ApiPropertyOptional({
        description: 'Número del documento de identidad (requerido si no se proporciona documentoIdentidadId)',
        example: '12345678'
    })
    @ValidateIf(o => !o.documentoIdentidadId)
    @IsNotEmpty()
    @IsString()
    numeroDocumento?: string;

    @ApiPropertyOptional({
        description: 'Fecha de emisión del documento',
        example: '2020-01-15'
    })
    @IsOptional()
    @IsDateString()
    fechaEmision?: string;

    @ApiPropertyOptional({
        description: 'Fecha de vencimiento del documento',
        example: '2030-01-15'
    })
    @IsOptional()
    @IsDateString()
    fechaVencimiento?: string;

    @ApiPropertyOptional({
        description: 'País emisor del documento',
        example: 'PE'
    })
    @IsOptional()
    @IsString()
    paisEmisor?: string;

    // =========== DATOS DEL USUARIO ===========

    @ApiProperty({
        description: 'Email único del usuario',
        example: 'admin@test.com'
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'Contraseña en texto plano (se hasheará automáticamente)',
        example: 'MiPassword123!'
    })
    @IsString()
    password: string;

    @ApiProperty({
        description: 'Nombre del usuario',
        example: 'Juan Carlos'
    })
    @IsString()
    nombre: string;

    @ApiProperty({
        description: 'Apellidos del usuario',
        example: 'Pérez García'
    })
    @IsString()
    apellidos: string;

    @ApiPropertyOptional({
        description: 'Teléfono del usuario',
        example: '987654321'
    })
    @IsOptional()
    @IsString()
    telefono?: string;

    @ApiPropertyOptional({
        description: 'Fecha de nacimiento',
        example: '1990-05-15'
    })
    @IsOptional()
    @IsDateString()
    fechaNacimiento?: string;

    @ApiPropertyOptional({
        description: 'Género',
        example: 'M',
        enum: ['M', 'F', 'O']
    })
    @IsOptional()
    @IsEnum(['M', 'F', 'O'])
    genero?: string;

    @ApiPropertyOptional({
        description: 'Dirección del usuario',
        example: 'Av. Los Jardines 123, Lima'
    })
    @IsOptional()
    @IsString()
    direccion?: string;

    @ApiProperty({
        description: 'ID del rol asignado',
        example: '123e4567-e89b-12d3-a456-426614174001'
    })
    @IsUUID()
    rolId: string;

    @ApiPropertyOptional({
        description: 'Si el usuario está activo',
        example: true,
        default: true
    })
    @IsOptional()
    @IsBoolean()
    activo?: boolean;

    @ApiPropertyOptional({
        description: 'Si debe cambiar contraseña en próximo login',
        example: false,
        default: false
    })
    @IsOptional()
    @IsBoolean()
    debeCambiarPassword?: boolean;
}