import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NivelAcceso } from '../entities/Rol';
import { TipoDocumento } from '../entities/DocumentoIdentidad';

export class UsuarioDocumentoResponseDto {
  @ApiProperty({ description: 'ID del documento de identidad', example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ description: 'Tipo de documento', enum: TipoDocumento, example: TipoDocumento.DNI })
  tipo: TipoDocumento;

  @ApiProperty({ description: 'Numero del documento', example: '12345678' })
  numero: string;

  constructor(partial: Partial<UsuarioDocumentoResponseDto>) {
    Object.assign(this, partial);
  }
}

export class UsuarioRolResponseDto {
  @ApiProperty({ description: 'ID del rol asociado', example: '123e4567-e89b-12d3-a456-426614174001' })
  id: string;

  @ApiProperty({ description: 'Nombre del rol', example: 'ADMIN' })
  nombre: string;

  @ApiProperty({ description: 'Nivel de acceso del rol', enum: NivelAcceso, example: NivelAcceso.ADMIN })
  nivelAcceso: NivelAcceso;

  constructor(partial: Partial<UsuarioRolResponseDto>) {
    Object.assign(this, partial);
  }
}

export class UsuarioResponseDto {
  @ApiProperty({ description: 'ID unico del usuario', example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ description: 'ID del documento de identidad asociado', example: '123e4567-e89b-12d3-a456-426614174000' })
  documentoIdentidadId: string;

  @ApiProperty({ description: 'Correo electronico del usuario', example: 'usuario@dominio.com' })
  email: string;

  @ApiProperty({ description: 'Nombre del usuario', example: 'Juan' })
  nombre: string;

  @ApiProperty({ description: 'Apellidos del usuario', example: 'Perez Garcia' })
  apellidos: string;

  @ApiPropertyOptional({ description: 'Telefono del usuario', example: '987654321', nullable: true })
  telefono?: string | null;

  @ApiProperty({ description: 'ID del rol asociado', example: '123e4567-e89b-12d3-a456-426614174001' })
  rolId: string;

  @ApiProperty({ description: 'Indicador de si el usuario esta activo', example: true, nullable: true })
  activo: boolean | null;

  @ApiPropertyOptional({ description: 'Fecha del ultimo acceso', example: '2025-01-01T10:00:00Z', nullable: true })
  ultimoAcceso?: Date | null;

  @ApiPropertyOptional({ description: 'Cantidad de intentos fallidos de autenticacion', example: 0, nullable: true })
  intentosFallidos?: number | null;

  @ApiPropertyOptional({ description: 'Fecha y hora hasta la que el usuario permanece bloqueado', example: '2025-01-01T10:30:00Z', nullable: true })
  bloqueadoHasta?: Date | null;

  @ApiProperty({ description: 'Indica si debe cambiar la contrasena en el siguiente inicio de sesion', example: false, nullable: true })
  debeCambiarPassword: boolean | null;

  @ApiPropertyOptional({ description: 'Fecha de creacion del registro', example: '2025-01-01T10:00:00Z', nullable: true })
  createdAt?: Date | null;

  @ApiPropertyOptional({ description: 'Fecha de ultima actualizacion del registro', example: '2025-01-01T10:00:00Z', nullable: true })
  updatedAt?: Date | null;

  @ApiPropertyOptional({ description: 'Informacion resumida del documento de identidad', type: () => UsuarioDocumentoResponseDto, nullable: true })
  documentoIdentidad?: UsuarioDocumentoResponseDto;

  @ApiPropertyOptional({ description: 'Informacion resumida del rol asociado', type: () => UsuarioRolResponseDto, nullable: true })
  rol?: UsuarioRolResponseDto;

  constructor(partial: Partial<UsuarioResponseDto>) {
    Object.assign(this, partial);
  }
}

export class UsuarioListResponseDto {
  @ApiProperty({ description: 'Listado de usuarios', type: () => [UsuarioResponseDto] })
  usuarios: UsuarioResponseDto[];

  @ApiProperty({ description: 'Total de registros encontrados', example: 25 })
  total: number;

  @ApiProperty({ description: 'Pagina actual', example: 1 })
  page: number;

  @ApiProperty({ description: 'Total de paginas', example: 3 })
  totalPages: number;

  constructor(partial: Partial<UsuarioListResponseDto>) {
    Object.assign(this, partial);
  }
}

export class UsuarioTrabajadorCompositeDto {
  @ApiProperty({ description: 'Usuario creado', type: () => UsuarioResponseDto })
  usuario: UsuarioResponseDto;

  @ApiProperty({ description: 'Trabajador creado en el people-service', type: Object })
  trabajador: Record<string, unknown>;

  constructor(partial: Partial<UsuarioTrabajadorCompositeDto>) {
    Object.assign(this, partial);
  }
}
