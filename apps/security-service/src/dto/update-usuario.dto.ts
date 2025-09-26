import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateUsuarioDto } from './create-usuario.dto';

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
    @ApiPropertyOptional({
        description: 'Email único del usuario',
        example: 'admin@test.com'
    })
    email?: string;

    @ApiPropertyOptional({
        description: 'Nombre del usuario',
        example: 'Juan Carlos'
    })
    nombre?: string;

    @ApiPropertyOptional({
        description: 'Apellidos del usuario',
        example: 'Pérez García'
    })
    apellidos?: string;

    @ApiPropertyOptional({
        description: 'Teléfono del usuario',
        example: '987654321'
    })
    telefono?: string;

    @ApiPropertyOptional({
        description: 'Si el usuario está activo',
        example: true
    })
    activo?: boolean;

    @ApiPropertyOptional({
        description: 'Intentos fallidos de login',
        example: 0
    })
    intentosFallidos?: number;

    @ApiPropertyOptional({
        description: 'Fecha hasta cuando está bloqueado',
        example: '2024-01-01T00:00:00Z'
    })
    bloqueadoHasta?: Date;
}