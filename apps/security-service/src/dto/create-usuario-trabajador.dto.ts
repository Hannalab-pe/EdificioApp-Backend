import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { CreateUsuarioWithDocumentoDto } from './create-usuario-with-documento.dto';
import { CreateTrabajadorForUsuarioDto } from './create-trabajador-for-usuario.dto';

export class CreateUsuarioTrabajadorDto {
  @ApiProperty({ type: () => CreateUsuarioWithDocumentoDto })
  @ValidateNested()
  @Type(() => CreateUsuarioWithDocumentoDto)
  usuario: CreateUsuarioWithDocumentoDto;

  @ApiProperty({ type: () => CreateTrabajadorForUsuarioDto })
  @ValidateNested()
  @Type(() => CreateTrabajadorForUsuarioDto)
  trabajador: CreateTrabajadorForUsuarioDto;
}
