// Rol DTOs
export { CreateRolDto } from './create-rol.dto';

export { UpdateRolDto } from './update-rol.dto';

export { RolResponseDto, RolListResponseDto } from './rol-response.dto';

// Usuario DTOs
export { CreateUsuarioDto } from './create-usuario.dto';

export { UpdateUsuarioDto } from './update-usuario.dto';

// Documento Identidad DTOs
export { CreateDocumentoIdentidadDto } from './create-documento-identidad.dto';

export { UpdateDocumentoIdentidadDto } from './update-documento-identidad.dto';

// Base Response DTO (para futuras respuestas genéricas)
export class BaseResponseDto {
  success: boolean;
  message: string;
  timestamp: Date;

  constructor(success: boolean, message: string) {
    this.success = success;
    this.message = message;
    this.timestamp = new Date();
  }
}
