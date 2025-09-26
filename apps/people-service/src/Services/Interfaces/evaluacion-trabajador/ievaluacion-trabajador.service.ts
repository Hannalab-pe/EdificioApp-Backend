import { BaseResponseDto, CreateEvaluacionTrabajadorDto, UpdateEvaluacionTrabajadorDto, EvaluacionTrabajadorResponseDto } from 'apps/people-service/src/Dtos';
import { EvaluacionTrabajador } from 'apps/people-service/src/entities/EvaluacionTrabajador';

export interface EvaluacionTrabajadorQuery {
  page?: number;
  limit?: number;
  trabajadorId?: string;
  evaluadorId?: string;
  periodo?: string;
  fechaEvaluacionDesde?: string;
  fechaEvaluacionHasta?: string;
}

export interface IEvaluacionTrabajadorService {
  create(data: CreateEvaluacionTrabajadorDto): Promise<BaseResponseDto<EvaluacionTrabajador>>;
  findAll(query?: EvaluacionTrabajadorQuery): Promise<BaseResponseDto<{ evaluaciones: EvaluacionTrabajadorResponseDto[], total: number, page: number, totalPages: number }>>;
  findOne(id: string): Promise<BaseResponseDto<EvaluacionTrabajadorResponseDto>>;
  findByTrabajadorId(trabajadorId: string): Promise<BaseResponseDto<EvaluacionTrabajadorResponseDto[]>>;
  findByEvaluadorId(evaluadorId: string): Promise<BaseResponseDto<EvaluacionTrabajadorResponseDto[]>>;
  update(id: string, data: UpdateEvaluacionTrabajadorDto): Promise<BaseResponseDto<EvaluacionTrabajador>>;
  remove(id: string): Promise<BaseResponseDto<void>>;
}
