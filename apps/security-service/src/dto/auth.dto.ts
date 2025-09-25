import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginDto {
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
    @MinLength(6)
    password: string;
}

export class RegisterDto {
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
    @MinLength(6)
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
        description: 'Teléfono (opcional)',
        example: '+51987654321'
    })
    @IsString()
    @IsOptional()
    telefono?: string;

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

export class ChangePasswordDto {
    @ApiProperty({
        description: 'Contraseña actual',
        example: 'oldpassword123'
    })
    @IsString()
    @IsNotEmpty()
    currentPassword: string;

    @ApiProperty({
        description: 'Nueva contraseña',
        example: 'newpassword123'
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    newPassword: string;
}

export class ResetPasswordDto {
    @ApiProperty({
        description: 'Token de reset',
        example: 'reset-token-123'
    })
    @IsString()
    @IsNotEmpty()
    token: string;

    @ApiProperty({
        description: 'Nueva contraseña',
        example: 'newpassword123'
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    newPassword: string;
}

export class RoleInfoDto {
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
        description: 'Nivel de acceso',
        example: 'ADMIN',
        enum: ['ADMIN', 'CONDOMINIO', 'RESIDENTE', 'TRABAJADOR']
    })
    nivelAcceso: string;
}

export class UserInfoDto {
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

    @ApiProperty({
        description: 'Rol del usuario'
    })
    rol: RoleInfoDto;

    @ApiProperty({
        description: 'Estado activo del usuario',
        example: true
    })
    activo: boolean;
}

export class AuthResponseDto {
    @ApiProperty({
        description: 'Token JWT de acceso',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
    })
    accessToken: string;

    @ApiProperty({
        description: 'Tipo de token',
        example: 'Bearer'
    })
    tokenType: string;

    @ApiProperty({
        description: 'Tiempo de expiración en segundos',
        example: 86400
    })
    expiresIn: number;

    @ApiProperty({
        description: 'Información del usuario'
    })
    user: UserInfoDto;
}