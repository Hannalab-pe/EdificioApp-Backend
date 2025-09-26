import { CreateTrabajadorDto, UpdateTrabajadorDto } from "apps/people-service/src/Dtos";
import { Trabajador } from "apps/people-service/src/entities/Trabajador";
import { BaseResponseDto } from "apps/people-service/src/Dtos/baseResponse.dto";


export interface ITrabajadorService {
    create(data: CreateTrabajadorDto): Promise<BaseResponseDto<Trabajador>>;
    findAll(): Promise<BaseResponseDto<Trabajador[]>>;
    findOne(id: string): Promise<BaseResponseDto<Trabajador>>;
    update(id: string, data: UpdateTrabajadorDto): Promise<BaseResponseDto<Trabajador>>;
    remove(id: string): Promise<BaseResponseDto<null>>;
    reactivate(id: string): Promise<BaseResponseDto<Trabajador>>;
}
