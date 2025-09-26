import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateDocumentoIdentidadDto } from './create-documento-identidad.dto';

export class UpdateDocumentoIdentidadDto extends PartialType(
  CreateDocumentoIdentidadDto,
) {
  @ApiPropertyOptional({
    description: 'Número del documento',
    example: '12345678',
  })
  numero?: string;

  @ApiPropertyOptional({
    description: 'País de emisión del documento',
    example: 'PE',
  })
  paisEmision?: string;

  @ApiPropertyOptional({
    description: 'Si el documento está validado',
    example: true,
  })
  validado?: boolean;

  @ApiPropertyOptional({
    description: 'Fecha de validación del documento',
    example: '2024-01-01T10:00:00Z',
  })
  fechaValidacion?: Date;
}
