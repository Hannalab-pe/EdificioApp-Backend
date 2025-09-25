import { HttpStatus, Injectable } from '@nestjs/common';
import { IInmobiliariaService } from '../../Interfaces';
import { BaseResponseDto } from 'apps/people-service/src/Dtos/baseResponse.dto';
import { Inmobiliaria } from 'apps/people-service/src/entities/Inmobiliaria';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateInmobiliariaDto } from 'apps/people-service/src/Dtos';

@Injectable()
export class InmobiliariaService implements IInmobiliariaService {

    constructor(@InjectRepository(Inmobiliaria) private readonly inmobiliariaRepository: Repository<Inmobiliaria>) { }

    async create(data: CreateInmobiliariaDto): Promise<BaseResponseDto<Inmobiliaria>> {
        try {
            // verificamos si la inmobiliaria ya existe o esta con el mismo RUC HA SIDO REGISTRADO
            const inmobiliariaExist = await this.inmobiliariaRepository.findOne({ where: { ruc: data.ruc } });
            if (!inmobiliariaExist) {
                const newInmobiliaria = this.inmobiliariaRepository.create(data);
                const savedInmobiliaria = await this.inmobiliariaRepository.save(newInmobiliaria);
                return BaseResponseDto.success<Inmobiliaria>(savedInmobiliaria, 'Inmobiliaria creada exitosamente', HttpStatus.CREATED);
            } else {
                return BaseResponseDto.error('Inmobiliaria ya existe con el mismo RUC', HttpStatus.BAD_REQUEST);
            }
        } catch (error) {
            return BaseResponseDto.error('Error al crear la inmobiliaria', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    findAll(): Promise<BaseResponseDto<Inmobiliaria[]>> {
        throw new Error('Method not implemented.');
    }
    findOne(id: number): Promise<BaseResponseDto<Inmobiliaria>> {
        throw new Error('Method not implemented.');
    }
    update(id: number, data: any): Promise<BaseResponseDto<Inmobiliaria>> {
        throw new Error('Method not implemented.');
    }
    remove(id: number): Promise<BaseResponseDto<null>> {
        throw new Error('Method not implemented.');
    }
}
