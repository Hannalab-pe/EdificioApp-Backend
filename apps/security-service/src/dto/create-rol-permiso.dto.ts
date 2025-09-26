import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsUUID } from 'class-validator';

export class CreateRolPermisoDto {
  @ApiProperty({
    description: 'ID del rol',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  rolId: string;

  @ApiProperty({
    description: 'ID del permiso',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  permisoId: string;

  @ApiProperty({
    description: 'Si el permiso está concedido al rol',
    example: true,
    default: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  concedido?: boolean;
}
