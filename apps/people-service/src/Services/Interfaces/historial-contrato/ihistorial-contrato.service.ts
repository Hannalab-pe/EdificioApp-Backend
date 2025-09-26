import { BaseResponseDto, CreateHistorialContratoDto, HistorialContratoResponseDto } from 'apps/people-service/src/Dtos';
import { HistorialContrato } from 'apps/people-service/src/entities/HistorialContrato';

export interface IHistorialContratoService {
  create(data: CreateHistorialContratoDto): Promise<BaseResponseDto<HistorialContrato>>;
  findByContratoId(contratoId: string): Promise<BaseResponseDto<HistorialContratoResponseDto[]>>;
  findAll(): Promise<BaseResponseDto<HistorialContratoResponseDto[]>>;
}