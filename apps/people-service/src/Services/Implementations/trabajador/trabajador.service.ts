import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseResponseDto } from '../../../Dtos/baseResponse.dto';
import { CreateTrabajadorDto, UpdateTrabajadorDto } from '../../../Dtos';
import { Trabajador } from '../../../entities/Trabajador';
import { ITrabajadorService } from '../../Interfaces';

@Injectable()
export class TrabajadorService implements ITrabajadorService {
    constructor(
        @InjectRepository(Trabajador)
        private readonly trabajadorRepository: Repository<Trabajador>,
    ) { }

    async create(data: CreateTrabajadorDto): Promise<BaseResponseDto<Trabajador>> {
        try {
            const existingByUsuario = await this.trabajadorRepository.findOne({
                where: { usuarioId: data.usuarioId, activo: true },
            });

            if (existingByUsuario) {
                return BaseResponseDto.error('Ya existe un trabajador activo para ese usuario', HttpStatus.BAD_REQUEST);
            }

            if (data.codigoEmpleado) {
                const existingByCodigo = await this.trabajadorRepository.findOne({
                    where: { codigoEmpleado: data.codigoEmpleado },
                });

                if (existingByCodigo) {
                    return BaseResponseDto.error('El codigo de empleado ya esta en uso', HttpStatus.BAD_REQUEST);
                }
            }

            const trabajadorToCreate = this.trabajadorRepository.create({
                ...data,
                activo: data.activo ?? true,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            const savedTrabajador = await this.trabajadorRepository.save(trabajadorToCreate);
            const fullTrabajador = await this.findByIdWithRelations(savedTrabajador.id);

            return BaseResponseDto.success<Trabajador>(
                fullTrabajador!,
                'Trabajador creado exitosamente',
                HttpStatus.CREATED,
            );
        } catch (error) {
            if (error.code === '23505') {
                if (error.constraint?.includes('codigo_empleado')) {
                    return BaseResponseDto.error('El codigo de empleado debe ser unico', HttpStatus.BAD_REQUEST);
                }
                return BaseResponseDto.error('Violacion de restriccion unica', HttpStatus.BAD_REQUEST);
            }

            console.error('Error al crear trabajador:', error);
            return BaseResponseDto.error('Error interno al crear el trabajador', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findAll(): Promise<BaseResponseDto<Trabajador[]>> {
        try {
            const trabajadores = await this.trabajadorRepository.find({
                where: { activo: true },
                relations: ['contratoes', 'evaluacionTrabajadors'],
            });

            if (trabajadores.length === 0) {
                return BaseResponseDto.error('No hay trabajadores registrados', HttpStatus.NOT_FOUND);
            }

            return BaseResponseDto.success<Trabajador[]>(
                trabajadores,
                'Trabajadores obtenidos exitosamente',
                HttpStatus.OK,
            );
        } catch (error) {
            console.error('Error al listar trabajadores:', error);
            return BaseResponseDto.error('Error interno al listar trabajadores', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findOne(id: string): Promise<BaseResponseDto<Trabajador>> {
        try {
            const trabajador = await this.findActiveById(id);

            if (!trabajador) {
                return BaseResponseDto.error('Trabajador no encontrado', HttpStatus.NOT_FOUND);
            }

            return BaseResponseDto.success<Trabajador>(
                trabajador,
                'Trabajador obtenido exitosamente',
                HttpStatus.OK,
            );
        } catch (error) {
            console.error('Error al obtener trabajador:', error);
            return BaseResponseDto.error('Error interno al obtener el trabajador', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async update(id: string, data: UpdateTrabajadorDto): Promise<BaseResponseDto<Trabajador>> {
        try {
            const trabajador = await this.findActiveById(id);

            if (!trabajador) {
                return BaseResponseDto.error('Trabajador no encontrado', HttpStatus.NOT_FOUND);
            }

            if (data.codigoEmpleado) {
                const existingByCodigo = await this.trabajadorRepository.findOne({
                    where: { codigoEmpleado: data.codigoEmpleado },
                });

                if (existingByCodigo && existingByCodigo.id !== id) {
                    return BaseResponseDto.error('El codigo de empleado ya esta en uso', HttpStatus.BAD_REQUEST);
                }
            }

            Object.assign(trabajador, data, { updatedAt: new Date() });

            await this.trabajadorRepository.save(trabajador);
            const updatedTrabajador = await this.findByIdWithRelations(id);

            return BaseResponseDto.success<Trabajador>(
                updatedTrabajador!,
                'Trabajador actualizado exitosamente',
                HttpStatus.OK,
            );
        } catch (error) {
            if (error.code === '23505') {
                return BaseResponseDto.error('Violacion de restriccion unica (codigo de empleado duplicado)', HttpStatus.BAD_REQUEST);
            }

            console.error('Error al actualizar trabajador:', error);
            return BaseResponseDto.error('Error interno al actualizar el trabajador', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async remove(id: string): Promise<BaseResponseDto<null>> {
        try {
            const trabajador = await this.findActiveById(id);

            if (!trabajador) {
                return BaseResponseDto.error('Trabajador no encontrado', HttpStatus.NOT_FOUND);
            }

            trabajador.activo = false;
            trabajador.updatedAt = new Date();

            await this.trabajadorRepository.save(trabajador);

            return BaseResponseDto.success<null>(
                null,
                'Trabajador desactivado exitosamente',
                HttpStatus.OK,
            );
        } catch (error) {
            console.error('Error al desactivar trabajador:', error);
            return BaseResponseDto.error('Error interno al desactivar el trabajador', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async reactivate(id: string): Promise<BaseResponseDto<Trabajador>> {
        try {
            const trabajador = await this.trabajadorRepository.findOne({
                where: { id, activo: false },
            });

            if (!trabajador) {
                return BaseResponseDto.error('Trabajador no encontrado o ya esta activo', HttpStatus.NOT_FOUND);
            }

            trabajador.activo = true;
            trabajador.updatedAt = new Date();

            await this.trabajadorRepository.save(trabajador);
            const reactivatedTrabajador = await this.findByIdWithRelations(id);

            return BaseResponseDto.success<Trabajador>(
                reactivatedTrabajador!,
                'Trabajador reactivado exitosamente',
                HttpStatus.OK,
            );
        } catch (error) {
            console.error('Error al reactivar trabajador:', error);
            return BaseResponseDto.error('Error interno al reactivar el trabajador', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private async findByIdWithRelations(id: string): Promise<Trabajador | null> {
        return this.trabajadorRepository.findOne({
            where: { id },
            relations: ['contratoes', 'evaluacionTrabajadors'],
        });
    }

    private async findActiveById(id: string): Promise<Trabajador | null> {
        return this.trabajadorRepository.findOne({
            where: { id, activo: true },
            relations: ['contratoes', 'evaluacionTrabajadors'],
        });
    }
}
