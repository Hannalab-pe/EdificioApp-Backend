import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsUUID,
  IsObject,
  IsIP,
} from 'class-validator';

export class CreateAuditoriaAccesoDto {
  @ApiProperty({
    description:
      'ID del usuario que realiza la acción (opcional para acciones anónimas)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  usuarioId?: string;

  @ApiProperty({
    description: 'Acción realizada',
    example: 'LOGIN_EXITOSO',
  })
  @IsString()
  accion: string;

  @ApiProperty({
    description: 'Recurso o endpoint accedido',
    example: '/api/usuarios',
    required: false,
  })
  @IsOptional()
  @IsString()
  recurso?: string;

  @ApiProperty({
    description: 'Detalles adicionales de la acción en formato JSON',
    example: { metodo: 'POST', datos: 'usuario creado' },
    required: false,
  })
  @IsOptional()
  @IsObject()
  detalles?: object;

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
    description: 'Si la acción fue exitosa o falló',
    example: true,
  })
  @IsBoolean()
  exitoso: boolean;
}
