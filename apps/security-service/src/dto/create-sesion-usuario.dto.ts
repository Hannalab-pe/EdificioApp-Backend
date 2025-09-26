import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsUUID,
  IsDateString,
  IsIP,
} from 'class-validator';

export class CreateSesionUsuarioDto {
  @ApiProperty({
    description: 'ID del usuario',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  usuarioId: string;

  @ApiProperty({
    description: 'Hash del token de sesión',
    example: 'abc123def456...',
  })
  @IsString()
  tokenHash: string;

  @ApiProperty({
    description: 'Información del dispositivo',
    example: 'Windows 10 Chrome',
    required: false,
  })
  @IsOptional()
  @IsString()
  dispositivo?: string;

  @ApiProperty({
    description: 'Dirección IP del cliente',
    example: '192.168.1.100',
    required: false,
  })
  @IsOptional()
  @IsString()
  ipAddress?: string;

  @ApiProperty({
    description: 'User Agent del navegador',
    example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)...',
    required: false,
  })
  @IsOptional()
  @IsString()
  userAgent?: string;

  @ApiProperty({
    description: 'Fecha y hora de expiración de la sesión',
    example: '2025-12-31T23:59:59.000Z',
  })
  @IsDateString()
  expiraEn: Date;

  @ApiProperty({
    description: 'Si la sesión está activa',
    example: true,
    default: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  activa?: boolean;
}
