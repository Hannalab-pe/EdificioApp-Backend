<<<<<<< HEAD
// DTOs para creación (Create)
export { CreateUsuarioDto } from './create-usuario.dto';
export { CreateDocumentoIdentidadDto } from './create-documento-identidad.dto';
export { CreatePermisoDto } from './create-permiso.dto';
export { CreateRolDto } from './create-rol.dto';
export { CreateRolPermisoDto } from './create-rol-permiso.dto';
export { CreateSesionUsuarioDto } from './create-sesion-usuario.dto';
export { CreateAuditoriaAccesoDto } from './create-auditoria-acceso.dto';

// DTOs para actualización (Update)
export { UpdateUsuarioDto } from './update-usuario.dto';
export { UpdateDocumentoIdentidadDto } from './update-documento-identidad.dto';
export { UpdatePermisoDto } from './update-permiso.dto';
export { UpdateRolDto } from './update-rol.dto';
export { UpdateRolPermisoDto } from './update-rol-permiso.dto';
export { UpdateSesionUsuarioDto } from './update-sesion-usuario.dto';
=======
import { ApiProperty } from '@nestjs/swagger';

// Rol DTOs
export { CreateRolDto } from './create-rol.dto';
export { UpdateRolDto } from './update-rol.dto';
export { RolResponseDto, RolListResponseDto } from './rol-response.dto';

// Usuario DTOs
export { CreateUsuarioDto } from './create-usuario.dto';
export { UpdateUsuarioDto } from './update-usuario.dto';
export { CreateUsuarioTrabajadorDto } from './create-usuario-trabajador.dto';
export { CreateUsuarioWithDocumentoDto } from './create-usuario-with-documento.dto';
export { CreateTrabajadorForUsuarioDto } from './create-trabajador-for-usuario.dto';
export { UsuarioResponseDto, UsuarioListResponseDto, UsuarioTrabajadorCompositeDto } from './usuario-response.dto';
export { BlockUsuarioDto } from './block-usuario.dto';

// Documento Identidad DTOs
export { CreateDocumentoIdentidadDto } from './create-documento-identidad.dto';
export { UpdateDocumentoIdentidadDto } from './update-documento-identidad.dto';

// Base Response DTO generico
export class BaseResponseDto<T> {
  @ApiProperty({ description: 'Indica si la operacion fue exitosa' })
  success: boolean;

  @ApiProperty({ description: 'Mensaje descriptivo de la respuesta' })
  message: string;

  @ApiProperty({ description: 'Datos de la respuesta', required: false })
  data?: T;

  @ApiProperty({ description: 'Informacion del error si aplica', required: false })
  error?: any;

  @ApiProperty({ description: 'Codigo de estado HTTP asociado', required: false })
  statusCode?: number;

  @ApiProperty({ description: 'Marca de tiempo de la respuesta' })
  timestamp: string;

  constructor(
    success: boolean,
    message: string,
    data?: T,
    error?: any,
    statusCode?: number,
  ) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.error = error;
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();
  }

  static success<T>(
    data: T,
    message: string,
    statusCode?: number,
  ): BaseResponseDto<T> {
    return new BaseResponseDto<T>(true, message, data, undefined, statusCode);
  }

  static error<T>(
    message: string,
    statusCode?: number,
    error?: any,
  ): BaseResponseDto<T> {
    return new BaseResponseDto<T>(false, message, undefined, error, statusCode);
  }
}
>>>>>>> 872c80c6d7bf7361f9d25592c6a22381544844d2
