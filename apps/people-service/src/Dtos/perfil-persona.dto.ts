import {
  IsString,
  IsOptional,
  IsDateString,
  IsEnum,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EstadoCivil } from '../Enum/residente.enum';

export class CreatePerfilPersonaDto {
  @ApiProperty({
    description: 'ID del usuario asociado',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  usuarioId: string;

  @ApiPropertyOptional({
    description: 'URL de la foto de perfil',
    example: 'https://example.com/foto.jpg',
  })
  @IsOptional()
  @IsString()
  fotoUrl?: string;

  @ApiPropertyOptional({
    description: 'Fecha de nacimiento',
    example: '1990-01-01',
  })
  @IsOptional()
  @IsDateString()
  fechaNacimiento?: string;

  @ApiPropertyOptional({ description: 'Estado civil', enum: EstadoCivil })
  @IsOptional()
  @IsEnum(EstadoCivil)
  estadoCivil?: EstadoCivil;

  @ApiPropertyOptional({
    description: 'Profesión',
    example: 'Ingeniero de Software',
  })
  @IsOptional()
  @IsString()
  profesion?: string;

  @ApiPropertyOptional({
    description: 'Empresa donde trabaja',
    example: 'Tech Corp',
  })
  @IsOptional()
  @IsString()
  empresaTrabajo?: string;

  @ApiPropertyOptional({
    description: 'Teléfono de trabajo',
    example: '+51987654321',
  })
  @IsOptional()
  @IsString()
  telefonoTrabajo?: string;

  @ApiPropertyOptional({
    description: 'Nombre del contacto de emergencia',
    example: 'Juan Pérez',
  })
  @IsOptional()
  @IsString()
  contactoEmergenciaNombre?: string;

  @ApiPropertyOptional({
    description: 'Teléfono del contacto de emergencia',
    example: '+51912345678',
  })
  @IsOptional()
  @IsString()
  contactoEmergenciaTelefono?: string;
}

export class UpdatePerfilPersonaDto {
  @ApiPropertyOptional({
    description: 'URL de la foto de perfil',
    example: 'https://example.com/foto.jpg',
  })
  @IsOptional()
  @IsString()
  fotoUrl?: string;

  @ApiPropertyOptional({
    description: 'Fecha de nacimiento',
    example: '1990-01-01',
  })
  @IsOptional()
  @IsDateString()
  fechaNacimiento?: string;

  @ApiPropertyOptional({ description: 'Estado civil', enum: EstadoCivil })
  @IsOptional()
  @IsEnum(EstadoCivil)
  estadoCivil?: EstadoCivil;

  @ApiPropertyOptional({
    description: 'Profesión',
    example: 'Ingeniero de Software',
  })
  @IsOptional()
  @IsString()
  profesion?: string;

  @ApiPropertyOptional({
    description: 'Empresa donde trabaja',
    example: 'Tech Corp',
  })
  @IsOptional()
  @IsString()
  empresaTrabajo?: string;

  @ApiPropertyOptional({
    description: 'Teléfono de trabajo',
    example: '+51987654321',
  })
  @IsOptional()
  @IsString()
  telefonoTrabajo?: string;

  @ApiPropertyOptional({
    description: 'Nombre del contacto de emergencia',
    example: 'Juan Pérez',
  })
  @IsOptional()
  @IsString()
  contactoEmergenciaNombre?: string;

  @ApiPropertyOptional({
    description: 'Teléfono del contacto de emergencia',
    example: '+51912345678',
  })
  @IsOptional()
  @IsString()
  contactoEmergenciaTelefono?: string;
}

export class PerfilPersonaResponseDto {
  @ApiProperty({
    description: 'ID único del perfil',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'ID del usuario asociado',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  usuarioId: string;

  @ApiPropertyOptional({
    description: 'URL de la foto de perfil',
    example: 'https://example.com/foto.jpg',
  })
  fotoUrl?: string;

  @ApiPropertyOptional({
    description: 'Fecha de nacimiento',
    example: '1990-01-01',
  })
  fechaNacimiento?: string;

  @ApiPropertyOptional({ description: 'Estado civil', enum: EstadoCivil })
  estadoCivil?: EstadoCivil;

  @ApiPropertyOptional({
    description: 'Profesión',
    example: 'Ingeniero de Software',
  })
  profesion?: string;

  @ApiPropertyOptional({
    description: 'Empresa donde trabaja',
    example: 'Tech Corp',
  })
  empresaTrabajo?: string;

  @ApiPropertyOptional({
    description: 'Teléfono de trabajo',
    example: '+51987654321',
  })
  telefonoTrabajo?: string;

  @ApiPropertyOptional({
    description: 'Nombre del contacto de emergencia',
    example: 'Juan Pérez',
  })
  contactoEmergenciaNombre?: string;

  @ApiPropertyOptional({
    description: 'Teléfono del contacto de emergencia',
    example: '+51912345678',
  })
  contactoEmergenciaTelefono?: string;

  @ApiProperty({ description: 'Fecha de creación' })
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización' })
  updatedAt: Date;

  @ApiPropertyOptional({ description: 'Información del usuario asociado' })
  usuario?: {
    id: string;
    nombre: string;
    apellidos: string;
    email: string;
    telefono?: string;
  };

  constructor(data: Partial<PerfilPersonaResponseDto>) {
    Object.assign(this, data);
  }
}
