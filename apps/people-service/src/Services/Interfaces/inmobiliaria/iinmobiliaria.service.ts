import { CreateInmobiliariaDto, UpdateInmobiliariaDto } from "apps/people-service/src/Dtos";
import { BaseResponseDto } from "apps/people-service/src/Dtos/baseResponse.dto";
import { Inmobiliaria } from "apps/people-service/src/entities/Inmobiliaria";

export interface IInmobiliariaService {
    create(data: CreateInmobiliariaDto): Promise<BaseResponseDto<Inmobiliaria>>;
    findAll(): Promise<BaseResponseDto<Inmobiliaria[]>>;
    findOne(id: string): Promise<BaseResponseDto<Inmobiliaria>>;
    update(id: string, data: UpdateInmobiliariaDto): Promise<BaseResponseDto<Inmobiliaria>>;
    remove(id: string): Promise<BaseResponseDto<null>>;
    reactivate(id: string): Promise<BaseResponseDto<Inmobiliaria>>;
}