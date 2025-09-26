import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsEnum } from 'class-validator';
import { NivelAcceso } from '../entities/Rol';

export class CreateRolDto {
    @ApiProperty({
        description: 'Nombre único del rol',
        example: 'ADMIN'
    })
    @IsString()
    nombre: string;

    @ApiProperty({
        description: 'Descripción del rol',
        example: 'Administrador del sistema',
        required: false
    })
    @IsOptional()
    @IsString()
    descripcion?: string;

    @ApiProperty({
        description: 'Nivel de acceso del rol',
        enum: NivelAcceso,
        example: NivelAcceso.ADMIN
    })
    @IsEnum(NivelAcceso)
    nivelAcceso: NivelAcceso;

    @ApiProperty({
        description: 'Si el rol está activo',
        example: true,
        default: true,
        required: false
    })
    @IsOptional()
    @IsBoolean()
    activo?: boolean;
}