import { ApiProperty } from '@nestjs/swagger';
import { NivelAcceso } from '../entities/Rol';

export class RolResponseDto {
  @ApiProperty({
    description: 'ID único del rol',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  id: string;

  @ApiProperty({
    description: 'Nombre único del rol',
    example: 'ADMIN',
  })
  nombre: string;

  @ApiProperty({
    description: 'Descripción del rol',
    example: 'Administrador del sistema',
    nullable: true,
  })
  descripcion: string | null;

  @ApiProperty({
    description: 'Nivel de acceso del rol',
    enum: NivelAcceso,
    example: NivelAcceso.ADMIN,
  })
  nivelAcceso: NivelAcceso;

  @ApiProperty({
    description: 'Estado activo del rol',
    example: true,
    nullable: true,
  })
  activo: boolean | null;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2024-01-15T10:30:00Z',
    nullable: true,
  })
  createdAt: Date | null;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2024-01-15T10:30:00Z',
    nullable: true,
  })
  updatedAt: Date | null;

  constructor(partial: Partial<RolResponseDto>) {
    Object.assign(this, partial);
  }
}

export class RolListResponseDto {
  @ApiProperty({
    description: 'Lista de roles',
    type: [RolResponseDto],
  })
  roles: RolResponseDto[];

  @ApiProperty({
    description: 'Total de registros',
    example: 25,
  })
  total: number;

  @ApiProperty({
    description: 'Página actual',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Total de páginas',
    example: 3,
  })
  totalPages: number;

  constructor(partial: Partial<RolListResponseDto>) {
    Object.assign(this, partial);
  }
}
