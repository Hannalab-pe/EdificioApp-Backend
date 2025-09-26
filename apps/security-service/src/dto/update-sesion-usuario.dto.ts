import { PartialType } from '@nestjs/swagger';
import { CreateSesionUsuarioDto } from './create-sesion-usuario.dto';

export class UpdateSesionUsuarioDto extends PartialType(
  CreateSesionUsuarioDto,
) {}
