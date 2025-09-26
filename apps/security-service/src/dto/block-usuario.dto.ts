import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601 } from 'class-validator';

export class BlockUsuarioDto {
  @ApiProperty({
    description: 'Fecha y hora hasta la que el usuario permanecera bloqueado (ISO 8601)',
    example: '2025-01-01T12:00:00Z',
  })
  @IsISO8601()
  until: string;
}
