import { IsString, IsOptional, IsBoolean, IsEmail, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateContactoEmergenciaDto {
  @ApiProperty({ description: 'ID del usuario asociado', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  usuarioId: string;

  @ApiProperty({ description: 'Nombre completo del contacto', example: 'María García López' })
  @IsString()
  nombre: string;

  @ApiPropertyOptional({ description: 'Relación con el usuario', example: 'Madre' })
  @IsOptional()
  @IsString()
  relacion?: string;

  @ApiProperty({ description: 'Teléfono principal', example: '+51987654321' })
  @IsString()
  telefono: string;

  @ApiPropertyOptional({ description: 'Teléfono alternativo', example: '+51912345678' })
  @IsOptional()
  @IsString()
  telefonoAlternativo?: string;

  @ApiPropertyOptional({ description: 'Correo electrónico', example: 'maria.garcia@email.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: 'Dirección completa', example: 'Av. Principal 123, Lima, Perú' })
  @IsOptional()
  @IsString()
  direccion?: string;

  @ApiPropertyOptional({ description: 'Indica si es el contacto principal', example: true, default: false })
  @IsOptional()
  @IsBoolean()
  esContactoPrincipal?: boolean;

  @ApiPropertyOptional({ description: 'Estado activo/inactivo', example: true, default: true })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}

export class UpdateContactoEmergenciaDto {
  @ApiPropertyOptional({ description: 'Nombre completo del contacto', example: 'María García López' })
  @IsOptional()
  @IsString()
  nombre?: string;

  @ApiPropertyOptional({ description: 'Relación con el usuario', example: 'Madre' })
  @IsOptional()
  @IsString()
  relacion?: string;

  @ApiPropertyOptional({ description: 'Teléfono principal', example: '+51987654321' })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiPropertyOptional({ description: 'Teléfono alternativo', example: '+51912345678' })
  @IsOptional()
  @IsString()
  telefonoAlternativo?: string;

  @ApiPropertyOptional({ description: 'Correo electrónico', example: 'maria.garcia@email.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: 'Dirección completa', example: 'Av. Principal 123, Lima, Perú' })
  @IsOptional()
  @IsString()
  direccion?: string;

  @ApiPropertyOptional({ description: 'Indica si es el contacto principal', example: true })
  @IsOptional()
  @IsBoolean()
  esContactoPrincipal?: boolean;

  @ApiPropertyOptional({ description: 'Estado activo/inactivo', example: true })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}

export class ContactoEmergenciaResponseDto {
  @ApiProperty({ description: 'ID único del contacto', example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ description: 'ID del usuario asociado', example: '123e4567-e89b-12d3-a456-426614174000' })
  usuarioId: string;

  @ApiProperty({ description: 'Nombre completo del contacto', example: 'María García López' })
  nombre: string;

  @ApiPropertyOptional({ description: 'Relación con el usuario', example: 'Madre' })
  relacion?: string;

  @ApiProperty({ description: 'Teléfono principal', example: '+51987654321' })
  telefono: string;

  @ApiPropertyOptional({ description: 'Teléfono alternativo', example: '+51912345678' })
  telefonoAlternativo?: string;

  @ApiPropertyOptional({ description: 'Correo electrónico', example: 'maria.garcia@email.com' })
  email?: string;

  @ApiPropertyOptional({ description: 'Dirección completa', example: 'Av. Principal 123, Lima, Perú' })
  direccion?: string;

  @ApiProperty({ description: 'Indica si es el contacto principal', example: true })
  esContactoPrincipal: boolean;

  @ApiProperty({ description: 'Estado activo/inactivo', example: true })
  activo: boolean;

  @ApiProperty({ description: 'Fecha de creación' })
  createdAt: Date;
}