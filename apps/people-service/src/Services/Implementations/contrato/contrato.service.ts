import { HttpStatus, Injectable } from '@nestjs/common';
import { IContratoService } from '../../Interfaces';
import { CreateContratoDto, BaseResponseDto, UpdateContratoDto } from 'apps/people-service/src/Dtos';
import { Contrato } from 'apps/people-service/src/entities/Contrato';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ContratoService implements IContratoService {

    constructor(@InjectRepository(Contrato) private contratoRepository: Repository<Contrato>
    private readonly contratoRepository: 
    ) { }

    async create(data: CreateContratoDto): Promise<BaseResponseDto<Contrato>> {
        try {
            if (!data) {
                return await BaseResponseDto.error<Contrato>('No se proporcionaron datos para crear el contrato.', HttpStatus.BAD_REQUEST);
            }

            const trabajadorFound = await this.contratoRepository.findOne({ where: { id: data.trabajadorId } });
            const newContrato = this.contratoRepository.create(data);
            const savedContrato = await this.contratoRepository.save(newContrato);
            return BaseResponseDto.success<Contrato>(savedContrato, 'Contrato creado exitosamente.', HttpStatus.CREATED);
        } catch (error) {
            return BaseResponseDto.error<Contrato>('Error al crear el contrato: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    findAll(): Promise<BaseResponseDto<Contrato[]>> {
        throw new Error('Method not implemented.');
    }
    findOne(id: number): Promise<BaseResponseDto<Contrato>> {
        throw new Error('Method not implemented.');
    }
    update(id: string, data: UpdateContratoDto): Promise<BaseResponseDto<Contrato>> {
        throw new Error('Method not implemented.');
    }
    removeLogical(id: string): Promise<BaseResponseDto<void>> {
        throw new Error('Method not implemented.');
    }
}
