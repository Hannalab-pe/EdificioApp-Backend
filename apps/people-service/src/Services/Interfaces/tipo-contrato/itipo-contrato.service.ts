import { CreateTipoContratoDto, UpdateTipoContratoDto } from "apps/people-service/src/Dtos";
import { BaseResponseDto } from "apps/people-service/src/Dtos/baseResponse.dto";
import { TipoContrato } from "apps/people-service/src/entities/TipoContrato";

export interface ITipoContratoService {
    create(data: CreateTipoContratoDto): Promise<BaseResponseDto<TipoContrato>>;
    findAll(): Promise<BaseResponseDto<TipoContrato>>;
    findOne(id: string): Promise<BaseResponseDto<TipoContrato>>;
    update(id: string, data: UpdateTipoContratoDto): Promise<BaseResponseDto<TipoContrato>>;
    remove(id: string): Promise<BaseResponseDto<void>>;
    findByNombre(nombre: string): Promise<BaseResponseDto<TipoContrato>>;
    findActivos(): Promise<BaseResponseDto<TipoContrato[]>>;
}
