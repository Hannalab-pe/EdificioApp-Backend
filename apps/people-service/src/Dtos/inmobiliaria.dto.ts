import { IsString, IsOptional, IsBoolean, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateInmobiliariaDto {
  @ApiProperty({
    description: 'Razón social de la inmobiliaria',
    example: 'Inmobiliaria Los Andes S.A.C.',
  })
  @IsString()
  razonSocial: string;

  @ApiPropertyOptional({
    description: 'RUC de la inmobiliaria',
    example: '20123456789',
  })
  @IsOptional()
  @IsString()
  ruc?: string;

  @ApiPropertyOptional({
    description: 'Dirección completa de la inmobiliaria',
    example: 'Av. Principal 789, Oficina 501, San Isidro, Lima',
  })
  @IsOptional()
  @IsString()
  direccion?: string;

  @ApiPropertyOptional({
    description: 'Teléfono de contacto',
    example: '+5114567890',
  })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiPropertyOptional({
    description: 'Correo electrónico',
    example: 'contacto@inmobiliarialosandes.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Nombre del representante legal',
    example: 'Carlos Rodríguez Mendoza',
  })
  @IsOptional()
  @IsString()
  representanteLegal?: string;

  @ApiPropertyOptional({
    description: 'Estado activo/inactivo',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  activa?: boolean;
}

export class UpdateInmobiliariaDto {
  @ApiPropertyOptional({
    description: 'Razón social de la inmobiliaria',
    example: 'Inmobiliaria Los Andes S.A.C.',
  })
  @IsOptional()
  @IsString()
  razonSocial?: string;

  @ApiPropertyOptional({
    description: 'RUC de la inmobiliaria',
    example: '20123456789',
  })
  @IsOptional()
  @IsString()
  ruc?: string;

  @ApiPropertyOptional({
    description: 'Dirección completa de la inmobiliaria',
    example: 'Av. Principal 789, Oficina 501, San Isidro, Lima',
  })
  @IsOptional()
  @IsString()
  direccion?: string;

  @ApiPropertyOptional({
    description: 'Teléfono de contacto',
    example: '+5114567890',
  })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiPropertyOptional({
    description: 'Correo electrónico',
    example: 'contacto@inmobiliarialosandes.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Nombre del representante legal',
    example: 'Carlos Rodríguez Mendoza',
  })
  @IsOptional()
  @IsString()
  representanteLegal?: string;

  @ApiPropertyOptional({ description: 'Estado activo/inactivo', example: true })
  @IsOptional()
  @IsBoolean()
  activa?: boolean;
}

export class InmobiliariaResponseDto {
  @ApiProperty({
    description: 'ID único de la inmobiliaria',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Razón social de la inmobiliaria',
    example: 'Inmobiliaria Los Andes S.A.C.',
  })
  razonSocial: string;

  @ApiPropertyOptional({
    description: 'RUC de la inmobiliaria',
    example: '20123456789',
  })
  ruc?: string;

  @ApiPropertyOptional({
    description: 'Dirección completa de la inmobiliaria',
    example: 'Av. Principal 789, Oficina 501, San Isidro, Lima',
  })
  direccion?: string;

  @ApiPropertyOptional({
    description: 'Teléfono de contacto',
    example: '+5114567890',
  })
  telefono?: string;

  @ApiPropertyOptional({
    description: 'Correo electrónico',
    example: 'contacto@inmobiliarialosandes.com',
  })
  email?: string;

  @ApiPropertyOptional({
    description: 'Nombre del representante legal',
    example: 'Carlos Rodríguez Mendoza',
  })
  representanteLegal?: string;

  @ApiProperty({ description: 'Estado activo/inactivo', example: true })
  activa: boolean;

  @ApiProperty({ description: 'Fecha de creación' })
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización' })
  updatedAt: Date;

  @ApiPropertyOptional({
    description: 'Número total de propietarios asociados',
    example: 15,
  })
  totalPropietarios?: number;
}
