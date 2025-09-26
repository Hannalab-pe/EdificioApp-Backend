import { CreateTrabajadorDto, UpdateTrabajadorDto } from "apps/people-service/src/Dtos";
import { Trabajador } from "apps/people-service/src/entities/Trabajador";
import { BaseResponseDto } from "apps/people-service/src/Dtos/baseResponse.dto";


export interface ITrabajadorService {
<<<<<<< HEAD
  create(data: any): Promise<any>;
  findAll(): Promise<any[]>;
  findOne(id: number): Promise<any>;
  update(id: number, data: any): Promise<any>;
  remove(id: number): Promise<void>;
=======
    create(data: CreateTrabajadorDto): Promise<BaseResponseDto<Trabajador>>;
    findAll(): Promise<BaseResponseDto<Trabajador[]>>;
    findOne(id: string): Promise<BaseResponseDto<Trabajador>>;
    update(id: string, data: UpdateTrabajadorDto): Promise<BaseResponseDto<Trabajador>>;
    remove(id: string): Promise<BaseResponseDto<null>>;
    reactivate(id: string): Promise<BaseResponseDto<Trabajador>>;
>>>>>>> 872c80c6d7bf7361f9d25592c6a22381544844d2
}
