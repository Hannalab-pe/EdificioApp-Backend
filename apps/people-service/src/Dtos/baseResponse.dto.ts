import { ApiProperty } from '@nestjs/swagger';

export class BaseResponseDto<T> {
  @ApiProperty({ description: 'Indica si la operación fue exitosa' })
  success: boolean;

  @ApiProperty({ description: 'Mensaje descriptivo de la respuesta' })
  message: string;

  @ApiProperty({ description: 'Datos de la respuesta' })
  data: any | T;

  @ApiProperty({ description: 'Error si existe', required: false })
  error?: any;

  @ApiProperty({ description: 'Código de estado HTTP', required: false })
  statusCode?: number;

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
