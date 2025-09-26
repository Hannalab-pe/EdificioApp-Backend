import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { TipoDocumento } from '../entities/DocumentoIdentidad';

export class CreateDocumentoIdentidadDto {
  @ApiProperty({
    description: 'Tipo de documento de identidad',
    enum: TipoDocumento,
    example: TipoDocumento.DNI,
  })
  @IsEnum(TipoDocumento)
  tipo: TipoDocumento;

  @ApiProperty({
    description: 'Número del documento',
    example: '12345678',
  })
  @IsString()
  numero: string;

  @ApiPropertyOptional({
    description: 'País de emisión del documento',
    example: 'PE',
    default: 'PE',
  })
  @IsOptional()
  @IsString()
  paisEmision?: string;

  @ApiPropertyOptional({
    description: 'Fecha de emisión del documento',
    example: '2020-01-01',
  })
  @IsOptional()
  @IsDateString()
  fechaEmision?: string;

  @ApiPropertyOptional({
    description: 'Fecha de vencimiento del documento',
    example: '2030-01-01',
  })
  @IsOptional()
  @IsDateString()
  fechaVencimiento?: string;

  @ApiPropertyOptional({
    description: 'Si el documento está validado',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  validado?: boolean;
}
