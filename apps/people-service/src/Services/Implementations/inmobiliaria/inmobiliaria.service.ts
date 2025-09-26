import { HttpStatus, Injectable } from '@nestjs/common';
import { IInmobiliariaService } from '../../Interfaces';
import { BaseResponseDto } from 'apps/people-service/src/Dtos/baseResponse.dto';
import { Inmobiliaria } from 'apps/people-service/src/entities/Inmobiliaria';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateInmobiliariaDto, UpdateInmobiliariaDto } from 'apps/people-service/src/Dtos/inmobiliaria.dto';

@Injectable()
export class InmobiliariaService implements IInmobiliariaService {

    constructor(@InjectRepository(Inmobiliaria) private readonly inmobiliariaRepository: Repository<Inmobiliaria>) { }

    async create(data: CreateInmobiliariaDto): Promise<BaseResponseDto<Inmobiliaria>> {
        try {
            // 1. Validar si ya existe una inmobiliaria activa con la misma razón social
            const existingByRazonSocial = await this.inmobiliariaRepository.findOne({
                where: {
                    razonSocial: data.razonSocial,
                    activa: true // Solo considerar inmobiliarias activas para evitar duplicados
                }
            });

            if (existingByRazonSocial) {
                return BaseResponseDto.error(
                    'Ya existe una inmobiliaria activa con esa razón social',
                    HttpStatus.BAD_REQUEST
                );
            }

            // 2. Validar si ya existe una inmobiliaria activa con el mismo RUC (si se proporciona)
            if (data.ruc) {
                const existingByRuc = await this.inmobiliariaRepository.findOne({
                    where: {
                        ruc: data.ruc,
                        activa: true // Solo considerar inmobiliarias activas
                    }
                });

                if (existingByRuc) {
                    return BaseResponseDto.error(
                        'Ya existe una inmobiliaria activa con ese RUC',
                        HttpStatus.BAD_REQUEST
                    );
                }
            }

            // 3. Crear la entidad con valores por defecto y timestamps automáticos
            const createData = {
                ...data,
                activa: data.activa ?? true, // Valor por defecto: activa
                createdAt: new Date(), // Timestamp de creación
                updatedAt: new Date()  // Timestamp inicial de actualización
            };

            const newInmobiliaria = this.inmobiliariaRepository.create(createData);

            // 4. Guardar en base de datos
            const savedInmobiliaria = await this.inmobiliariaRepository.save(newInmobiliaria);

            // 5. Obtener la entidad completa con relaciones para la respuesta
            const fullCreatedInmobiliaria = await this.inmobiliariaRepository.findOne({
                where: { id: savedInmobiliaria.id },
                relations: ['propietarios'] // Incluir relaciones para respuesta completa
            });

            return BaseResponseDto.success<Inmobiliaria>(
                fullCreatedInmobiliaria!,
                'Inmobiliaria creada exitosamente',
                HttpStatus.CREATED
            );

        } catch (error) {
            // Manejo específico de errores de base de datos
            if (error.code === '23505') { // Violation de constraint único en PostgreSQL
                // Identificar qué campo causó el error
                if (error.constraint?.includes('ruc')) {
                    return BaseResponseDto.error('El RUC ya está registrado', HttpStatus.BAD_REQUEST);
                }
                if (error.constraint?.includes('razon_social')) {
                    return BaseResponseDto.error('La razón social ya está registrada', HttpStatus.BAD_REQUEST);
                }
                return BaseResponseDto.error('Violación de restricción única', HttpStatus.BAD_REQUEST);
            }

            // Error genérico para cualquier otro problema
            console.error('Error al crear inmobiliaria:', error); // Log para debugging
            return BaseResponseDto.error(
                'Error interno al crear la inmobiliaria',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async findAll(): Promise<BaseResponseDto<Inmobiliaria[]>> {
        try {
            const inmobiliarias = await this.inmobiliariaRepository.find({
                where: { activa: true }, // Solo inmobiliarias activas
                relations: ['propietarios'] // Incluir propietarios asociados
            });

            if (inmobiliarias.length === 0) {
                return BaseResponseDto.error('No hay inmobiliarias registradas', HttpStatus.NOT_FOUND);
            }

            return BaseResponseDto.success<Inmobiliaria[]>(
                inmobiliarias,
                'Inmobiliarias obtenidas exitosamente',
                HttpStatus.OK
            );
        } catch (error) {
            console.error('Error al obtener inmobiliarias:', error);
            return BaseResponseDto.error(
                'Error interno al obtener las inmobiliarias',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async findOne(id: string): Promise<BaseResponseDto<Inmobiliaria | null>> {
        try {
            const inmobiliaria = await this.inmobiliariaRepository.findOne({
                where: { id, activa: true }, // Solo inmobiliarias activas
                relations: ['propietarios'] // Incluir propietarios asociados
            });

            if (!inmobiliaria) {
                return BaseResponseDto.error('Inmobiliaria no encontrada', HttpStatus.NOT_FOUND);
            }

            return BaseResponseDto.success<Inmobiliaria>(
                inmobiliaria,
                'Inmobiliaria obtenida exitosamente',
                HttpStatus.OK
            );
        } catch (error) {
            console.error('Error al obtener inmobiliaria:', error);
            return BaseResponseDto.error(
                'Error interno al obtener la inmobiliaria',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async update(id: string, data: UpdateInmobiliariaDto): Promise<BaseResponseDto<Inmobiliaria | null>> {
        try {
            // 1. Verificar que la inmobiliaria existe y está activa
            const inmobiliaria = await this.inmobiliariaRepository.findOne({
                where: { id, activa: true } // Solo inmobiliarias activas
            });

            if (!inmobiliaria) {
                return BaseResponseDto.error('Inmobiliaria no encontrada', HttpStatus.NOT_FOUND);
            }

            // 2. Validar si el RUC ya existe en otra inmobiliaria (si se está cambiando)
            if (data.ruc && data.ruc !== inmobiliaria.ruc) {
                const existingByRuc = await this.inmobiliariaRepository.findOne({
                    where: { ruc: data.ruc, activa: true }
                });
                if (existingByRuc && existingByRuc.id !== id) {
                    return BaseResponseDto.error('Ya existe una inmobiliaria con ese RUC', HttpStatus.BAD_REQUEST);
                }
            }

            // 3. Validar si la razón social ya existe en otra inmobiliaria (si se está cambiando)
            if (data.razonSocial && data.razonSocial !== inmobiliaria.razonSocial) {
                const existingByRazonSocial = await this.inmobiliariaRepository.findOne({
                    where: { razonSocial: data.razonSocial, activa: true }
                });
                if (existingByRazonSocial && existingByRazonSocial.id !== id) {
                    return BaseResponseDto.error('Ya existe una inmobiliaria con esa razón social', HttpStatus.BAD_REQUEST);
                }
            }

            // 4. Aplicar cambios con timestamp de actualización
            const updateData = {
                ...data,
                updatedAt: new Date() // Timestamp automático de actualización
            };

            this.inmobiliariaRepository.merge(inmobiliaria, updateData);
            await this.inmobiliariaRepository.save(inmobiliaria);

            // 5. Obtener la inmobiliaria actualizada con relaciones completas
            const fullUpdatedInmobiliaria = await this.inmobiliariaRepository.findOne({
                where: { id },
                relations: ['propietarios'] // Incluir propietarios para respuesta completa
            });

            return BaseResponseDto.success<Inmobiliaria>(
                fullUpdatedInmobiliaria!,
                'Inmobiliaria actualizada exitosamente',
                HttpStatus.OK
            );
        } catch (error) {
            // Manejo específico de errores SQL
            if (error.code === '23505') { // Violation de constraint único en PostgreSQL
                return BaseResponseDto.error('Violación de restricción única (RUC o razón social duplicados)', HttpStatus.BAD_REQUEST);
            }

            console.error('Error al actualizar inmobiliaria:', error);
            return BaseResponseDto.error(
                'Error interno al actualizar la inmobiliaria',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async remove(id: string): Promise<BaseResponseDto<null>> {
        try {
            const inmobiliaria = await this.inmobiliariaRepository.findOne({
                where: { id, activa: true },
                relations: ['propietarios']
            });

            if (!inmobiliaria) {
                return BaseResponseDto.error('Inmobiliaria no encontrada', HttpStatus.NOT_FOUND);
            }

            // Verificar si tiene propietarios asociados activos
            const propietariosActivos = inmobiliaria.propietarios?.filter(prop => prop.activo) || [];
            if (propietariosActivos.length > 0) {
                return BaseResponseDto.error(
                    `No se puede eliminar la inmobiliaria porque tiene ${propietariosActivos.length} propietario(s) asociado(s)`,
                    HttpStatus.BAD_REQUEST
                );
            }

            // Eliminación lógica: marcar como inactiva
            inmobiliaria.activa = false;
            inmobiliaria.updatedAt = new Date();

            await this.inmobiliariaRepository.save(inmobiliaria);

            return BaseResponseDto.success<null>(
                null,
                'Inmobiliaria desactivada exitosamente',
                HttpStatus.OK
            );
        } catch (error) {
            return BaseResponseDto.error('Error al desactivar la inmobiliaria', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async reactivate(id: string): Promise<BaseResponseDto<Inmobiliaria>> {
        try {
            const inmobiliaria = await this.inmobiliariaRepository.findOne({
                where: { id, activa: false }
            });

            if (!inmobiliaria) {
                return BaseResponseDto.error('Inmobiliaria no encontrada o ya está activa', HttpStatus.NOT_FOUND);
            }

            // Reactivar inmobiliaria
            inmobiliaria.activa = true;
            inmobiliaria.updatedAt = new Date();

            const reactivatedInmobiliaria = await this.inmobiliariaRepository.save(inmobiliaria);

            // Obtener la inmobiliaria reactivada con relaciones
            const fullReactivatedInmobiliaria = await this.inmobiliariaRepository.findOne({
                where: { id },
                relations: ['propietarios']
            });

            return BaseResponseDto.success<Inmobiliaria>(
                fullReactivatedInmobiliaria!,
                'Inmobiliaria reactivada exitosamente',
                HttpStatus.OK
            );
        } catch (error) {
            return BaseResponseDto.error('Error al reactivar la inmobiliaria', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
