import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRoleDto {
    @ApiProperty({
        description: 'Nombre del rol',
        example: 'ADMIN'
    })
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @ApiPropertyOptional({
        description: 'Descripción del rol',
        example: 'Administrador del sistema'
    })
    @IsString()
    @IsOptional()
    descripcion?: string;

    @ApiProperty({
        description: 'Nivel de acceso del rol',
        example: 'ADMIN',
        enum: ['ADMIN', 'CONDOMINIO', 'RESIDENTE', 'TRABAJADOR']
    })
    @IsString()
    @IsNotEmpty()
    nivelAcceso: string;
}

export class UpdateRoleDto {
    @ApiPropertyOptional({
        description: 'Nombre del rol',
        example: 'ADMIN'
    })
    @IsString()
    @IsOptional()
    nombre?: string;

    @ApiPropertyOptional({
        description: 'Descripción del rol',
        example: 'Administrador del sistema'
    })
    @IsString()
    @IsOptional()
    descripcion?: string;

    @ApiPropertyOptional({
        description: 'Nivel de acceso del rol',
        example: 'ADMIN',
        enum: ['ADMIN', 'CONDOMINIO', 'RESIDENTE', 'TRABAJADOR']
    })
    @IsString()
    @IsOptional()
    nivelAcceso?: string;

    @ApiPropertyOptional({
        description: 'Estado activo del rol',
        example: true
    })
    @IsBoolean()
    @IsOptional()
    activo?: boolean;
}

export class RoleDetailResponseDto {
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

    @ApiPropertyOptional({
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
        description: 'Estado activo',
        example: true
    })
    activo: boolean;

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

export class CreatePermissionDto {
    @ApiProperty({
        description: 'Módulo del permiso',
        example: 'users'
    })
    @IsString()
    @IsNotEmpty()
    modulo: string;

    @ApiProperty({
        description: 'Acción del permiso',
        example: 'create'
    })
    @IsString()
    @IsNotEmpty()
    accion: string;

    @ApiPropertyOptional({
        description: 'Recurso específico',
        example: 'profile'
    })
    @IsString()
    @IsOptional()
    recurso?: string;

    @ApiPropertyOptional({
        description: 'Descripción del permiso',
        example: 'Permite crear usuarios'
    })
    @IsString()
    @IsOptional()
    descripcion?: string;
}

export class UpdatePermissionDto {
    @ApiPropertyOptional({
        description: 'Módulo del permiso',
        example: 'users'
    })
    @IsString()
    @IsOptional()
    modulo?: string;

    @ApiPropertyOptional({
        description: 'Acción del permiso',
        example: 'create'
    })
    @IsString()
    @IsOptional()
    accion?: string;

    @ApiPropertyOptional({
        description: 'Recurso específico',
        example: 'profile'
    })
    @IsString()
    @IsOptional()
    recurso?: string;

    @ApiPropertyOptional({
        description: 'Descripción del permiso',
        example: 'Permite crear usuarios'
    })
    @IsString()
    @IsOptional()
    descripcion?: string;

    @ApiPropertyOptional({
        description: 'Estado activo del permiso',
        example: true
    })
    @IsBoolean()
    @IsOptional()
    activo?: boolean;
}

export class PermissionResponseDto {
    @ApiProperty({
        description: 'ID del permiso',
        example: 1
    })
    id: number;

    @ApiProperty({
        description: 'Módulo',
        example: 'users'
    })
    modulo: string;

    @ApiProperty({
        description: 'Acción',
        example: 'create'
    })
    accion: string;

    @ApiPropertyOptional({
        description: 'Recurso',
        example: 'profile'
    })
    recurso?: string;

    @ApiPropertyOptional({
        description: 'Descripción',
        example: 'Permite crear usuarios'
    })
    descripcion?: string;

    @ApiProperty({
        description: 'Estado activo',
        example: true
    })
    activo: boolean;

    @ApiProperty({
        description: 'Fecha de creación',
        example: '2024-01-01T00:00:00Z'
    })
    createdAt: Date;
}

export class AssignPermissionsToRoleDto {
    @ApiProperty({
        description: 'IDs de los permisos a asignar',
        example: [1, 2, 3],
        type: [Number]
    })
    @IsNumber({}, { each: true })
    permissionIds: number[];
}

export class RoleWithPermissionsResponseDto extends RoleDetailResponseDto {
    @ApiProperty({
        description: 'Permisos asignados al rol',
        type: [PermissionResponseDto]
    })
    permisos: PermissionResponseDto[];
}