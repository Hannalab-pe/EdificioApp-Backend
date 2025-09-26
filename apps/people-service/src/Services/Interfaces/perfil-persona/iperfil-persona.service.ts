import { BaseResponseDto, CreatePerfilPersonaDto, UpdatePerfilPersonaDto, PerfilPersonaResponseDto } from 'apps/people-service/src/Dtos';
import { PerfilPersona } from 'apps/people-service/src/entities/PerfilPersona';

export interface PerfilPersonaQuery {
  page?: number;
  limit?: number;
  usuarioId?: string;
  estadoCivil?: string;
  profesion?: string;
}

export interface IPerfilPersonaService {
  create(data: CreatePerfilPersonaDto): Promise<BaseResponseDto<PerfilPersona>>;
  findAll(query?: PerfilPersonaQuery): Promise<BaseResponseDto<{ perfiles: PerfilPersonaResponseDto[], total: number, page: number, totalPages: number }>>;
  findOne(id: string): Promise<BaseResponseDto<PerfilPersonaResponseDto>>;
  findByUsuarioId(usuarioId: string): Promise<BaseResponseDto<PerfilPersonaResponseDto>>;
  update(id: string, data: UpdatePerfilPersonaDto): Promise<BaseResponseDto<PerfilPersona>>;
  remove(id: string): Promise<BaseResponseDto<void>>;
}
