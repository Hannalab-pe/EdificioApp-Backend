import { BaseResponseDto, CreateContratoDto, UpdateContratoDto } from "apps/people-service/src/Dtos";
import { Contrato } from "apps/people-service/src/entities/Contrato";

export interface IContratoService {
    create(data: CreateContratoDto): Promise<BaseResponseDto<Contrato>>;
    findAll(): Promise<BaseResponseDto<Contrato[]>>;
    findOne(id: number): Promise<BaseResponseDto<Contrato>>;
    update(id: string, data: UpdateContratoDto): Promise<BaseResponseDto<Contrato>>;
    removeLogical(id: string): Promise<BaseResponseDto<void>>;
}
