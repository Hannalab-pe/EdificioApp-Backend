import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsUUID,
} from 'class-validator';

export class CreateUsuarioDto {
  @ApiProperty({
    description: 'ID del documento de identidad asociado',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  documentoIdentidadId: string;

  @ApiProperty({
    description: 'Email único del usuario',
    example: 'admin@test.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Hash de la contraseña',
    example: '$2b$12$hashedpassword123',
  })
  @IsString()
  passwordHash: string;

  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Juan Carlos',
  })
  @IsString()
  nombre: string;

  @ApiProperty({
    description: 'Apellidos del usuario',
    example: 'Pérez García',
  })
  @IsString()
  apellidos: string;

  @ApiPropertyOptional({
    description: 'Teléfono del usuario',
    example: '987654321',
  })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiProperty({
    description: 'ID del rol asignado',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  rolId: string;

  @ApiPropertyOptional({
    description: 'Si el usuario está activo',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @ApiPropertyOptional({
    description: 'Si debe cambiar contraseña en próximo login',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  debeCambiarPassword?: boolean;
}
