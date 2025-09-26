import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateRolDto } from './create-rol.dto';

export class UpdateRolDto extends PartialType(CreateRolDto) {
    @ApiProperty({
        description: 'Nombre único del rol',
        example: 'ADMIN',
        required: false
    })
    nombre?: string;

    @ApiProperty({
        description: 'Descripción del rol',
        example: 'Administrador del sistema',
        required: false
    })
    descripcion?: string;
}