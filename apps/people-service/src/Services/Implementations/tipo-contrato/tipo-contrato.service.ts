import { Injectable, ConflictException, NotFoundException, HttpStatus, BadRequestException } from '@nestjs/common';
import { ITipoContratoService } from '../../Interfaces';
import { CreateTipoContratoDto, UpdateTipoContratoDto } from 'apps/people-service/src/Dtos';
import { TipoContrato } from 'apps/people-service/src/entities/TipoContrato';
import { BaseResponseDto } from 'apps/security-service/src/dto';
import { Repository, IsNull } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TipoContratoService implements ITipoContratoService {

    constructor(
        @InjectRepository(TipoContrato)
        private readonly tipoContratoRepository: Repository<TipoContrato>
    ) { }

    // =========== CREATE ===========
    async create(data: CreateTipoContratoDto): Promise<BaseResponseDto<TipoContrato>> {
        try {
            // Verificar si ya existe un tipo de contrato con el mismo nombre (incluyendo eliminados)
            const existingTipoContrato = await this.tipoContratoRepository.findOne({
                where: { nombre: data.nombre }
            });

            if (existingTipoContrato) {
                if (existingTipoContrato.deletedAt) {
                    // Si está eliminado lógicamente, lo restauramos y actualizamos
                    existingTipoContrato.deletedAt = null;
                    existingTipoContrato.descripcion = data.descripcion || existingTipoContrato.descripcion;
                    existingTipoContrato.duracionDefaultMeses = data.duracionDefaultMeses ?? existingTipoContrato.duracionDefaultMeses;
                    existingTipoContrato.renovable = data.renovable ?? existingTipoContrato.renovable;
                    existingTipoContrato.activo = data.activo ?? existingTipoContrato.activo;
                    existingTipoContrato.updatedAt = new Date();

                    const restored = await this.tipoContratoRepository.save(existingTipoContrato);
                    return BaseResponseDto.success(
                        restored,
                        'Tipo de contrato restaurado y actualizado exitosamente',
                        HttpStatus.OK
                    );
                } else {
                    // Si existe y no está eliminado, error de duplicado
                    return BaseResponseDto.error(
                        `Ya existe un tipo de contrato con el nombre: ${data.nombre}`,
                        HttpStatus.CONFLICT
                    );
                }
            }

            // Crear nuevo tipo de contrato
            const nuevoTipoContrato = this.tipoContratoRepository.create({
                nombre: data.nombre,
                descripcion: data.descripcion,
                duracionDefaultMeses: data.duracionDefaultMeses,
                renovable: data.renovable ?? true,
                activo: data.activo ?? true,
                createdAt: new Date(),
                updatedAt: new Date()
            });

            const tipoContratoGuardado = await this.tipoContratoRepository.save(nuevoTipoContrato);

            return BaseResponseDto.success(
                tipoContratoGuardado,
                'Tipo de contrato creado exitosamente',
                HttpStatus.CREATED
            );

        } catch (error) {
            return BaseResponseDto.error(
                'Error al crear tipo de contrato: ' + error.message,
                HttpStatus.INTERNAL_SERVER_ERROR,
                error.message
            );
        }
    }

    // =========== FIND ALL (con paginación y filtros) ===========
    async findAll(query?: any): Promise<BaseResponseDto<TipoContrato>> {
        try {
            const { page = 1, limit = 10, nombre, activo, renovable } = query || {};

            const queryBuilder = this.tipoContratoRepository.createQueryBuilder('tipo_contrato');

            // Solo tipos de contrato NO eliminados
            queryBuilder.andWhere('tipo_contrato.deletedAt IS NULL');

            // Filtros opcionales
            if (nombre) {
                queryBuilder.andWhere('tipo_contrato.nombre ILIKE :nombre', { nombre: `%${nombre}%` });
            }

            if (activo !== undefined) {
                queryBuilder.andWhere('tipo_contrato.activo = :activo', { activo });
            }

            if (renovable !== undefined) {
                queryBuilder.andWhere('tipo_contrato.renovable = :renovable', { renovable });
            }

            // Paginación
            const skip = (page - 1) * limit;
            queryBuilder.skip(skip).take(limit);
            queryBuilder.orderBy('tipo_contrato.createdAt', 'DESC');

            const [tiposContrato, total] = await queryBuilder.getManyAndCount();
            const totalPages = Math.ceil(total / limit);

            const response = {
                tiposContrato,
                total,
                page: Number(page),
                totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1
            };

            return BaseResponseDto.success(
                response as any,
                `${total} tipos de contrato encontrados`,
                HttpStatus.OK
            );

        } catch (error) {
            return BaseResponseDto.error(
                'Error al obtener tipos de contrato: ' + error.message,
                HttpStatus.INTERNAL_SERVER_ERROR,
                error.message
            );
        }
    }

    // =========== FIND ONE ===========
    async findOne(id: string): Promise<BaseResponseDto<TipoContrato>> {
        try {
            if (!id) {
                return BaseResponseDto.error(
                    'ID es requerido',
                    HttpStatus.BAD_REQUEST
                );
            }

            const tipoContrato = await this.tipoContratoRepository.findOne({
                where: {
                    id,
                    deletedAt: IsNull() // Solo NO eliminados
                }
            });

            if (!tipoContrato) {
                return BaseResponseDto.error(
                    'Tipo de contrato no encontrado',
                    HttpStatus.NOT_FOUND
                );
            }

            return BaseResponseDto.success(
                tipoContrato,
                'Tipo de contrato encontrado exitosamente',
                HttpStatus.OK
            );

        } catch (error) {
            return BaseResponseDto.error(
                'Error al buscar tipo de contrato: ' + error.message,
                HttpStatus.INTERNAL_SERVER_ERROR,
                error.message
            );
        }
    }

    // =========== UPDATE ===========
    async update(id: string, data: UpdateTipoContratoDto): Promise<BaseResponseDto<TipoContrato>> {
        try {
            if (!id) {
                return BaseResponseDto.error(
                    'ID es requerido',
                    HttpStatus.BAD_REQUEST
                );
            }

            const tipoContrato = await this.tipoContratoRepository.findOne({
                where: {
                    id,
                    deletedAt: IsNull()
                }
            });

            if (!tipoContrato) {
                return BaseResponseDto.error(
                    'Tipo de contrato no encontrado',
                    HttpStatus.NOT_FOUND
                );
            }

            // Verificar nombre único si se está actualizando
            if (data.nombre && data.nombre !== tipoContrato.nombre) {
                const existingTipoContrato = await this.tipoContratoRepository.findOne({
                    where: {
                        nombre: data.nombre,
                        deletedAt: IsNull()
                    }
                });

                if (existingTipoContrato && existingTipoContrato.id !== id) {
                    return BaseResponseDto.error(
                        `Ya existe otro tipo de contrato con el nombre: ${data.nombre}`,
                        HttpStatus.CONFLICT
                    );
                }
            }

            // Actualizar campos
            if (data.nombre !== undefined) tipoContrato.nombre = data.nombre;
            if (data.descripcion !== undefined) tipoContrato.descripcion = data.descripcion;
            if (data.duracionDefaultMeses !== undefined) tipoContrato.duracionDefaultMeses = data.duracionDefaultMeses;
            if (data.renovable !== undefined) tipoContrato.renovable = data.renovable;
            if (data.activo !== undefined) tipoContrato.activo = data.activo;

            tipoContrato.updatedAt = new Date();

            const tipoContratoActualizado = await this.tipoContratoRepository.save(tipoContrato);

            return BaseResponseDto.success(
                tipoContratoActualizado,
                'Tipo de contrato actualizado exitosamente',
                HttpStatus.OK
            );

        } catch (error) {
            return BaseResponseDto.error(
                'Error al actualizar tipo de contrato: ' + error.message,
                HttpStatus.INTERNAL_SERVER_ERROR,
                error.message
            );
        }
    }

    // =========== REMOVE (Eliminado lógico) ===========
    async remove(id: string): Promise<BaseResponseDto<void>> {
        try {
            if (!id) {
                return BaseResponseDto.error(
                    'ID es requerido',
                    HttpStatus.BAD_REQUEST
                );
            }

            const tipoContrato = await this.tipoContratoRepository.findOne({
                where: {
                    id,
                    deletedAt: IsNull()
                }
            });

            if (!tipoContrato) {
                return BaseResponseDto.error(
                    'Tipo de contrato no encontrado',
                    HttpStatus.NOT_FOUND
                );
            }

            // Verificar si tiene contratos asociados activos
            // TODO: Implementar esta validación cuando esté la relación con contratos
            /*
            const contratosActivos = await this.contratoRepository.count({
                where: {
                    tipoContrato: { id },
                    activo: true
                }
            });

            if (contratosActivos > 0) {
                return BaseResponseDto.error(
                    'No se puede eliminar el tipo de contrato porque tiene contratos activos asociados',
                    HttpStatus.BAD_REQUEST
                );
            }
            */

            // Eliminado lógico
            tipoContrato.deletedAt = new Date();
            tipoContrato.activo = false; // También lo marcamos como inactivo
            tipoContrato.updatedAt = new Date();

            await this.tipoContratoRepository.save(tipoContrato);

            return BaseResponseDto.success(
                undefined,
                'Tipo de contrato eliminado exitosamente',
                HttpStatus.OK
            );

        } catch (error) {
            return BaseResponseDto.error(
                'Error al eliminar tipo de contrato: ' + error.message,
                HttpStatus.INTERNAL_SERVER_ERROR,
                error.message
            );
        }
    }

    // =========== FIND BY NOMBRE ===========
    async findByNombre(nombre: string): Promise<BaseResponseDto<TipoContrato>> {
        try {
            if (!nombre) {
                return BaseResponseDto.error(
                    'Nombre es requerido',
                    HttpStatus.BAD_REQUEST
                );
            }

            const tipoContrato = await this.tipoContratoRepository.findOne({
                where: {
                    nombre,
                    deletedAt: IsNull()
                }
            });

            if (!tipoContrato) {
                return BaseResponseDto.error(
                    'Tipo de contrato no encontrado',
                    HttpStatus.NOT_FOUND
                );
            }

            return BaseResponseDto.success(
                tipoContrato,
                'Tipo de contrato encontrado exitosamente',
                HttpStatus.OK
            );

        } catch (error) {
            return BaseResponseDto.error(
                'Error al buscar tipo de contrato por nombre: ' + error.message,
                HttpStatus.INTERNAL_SERVER_ERROR,
                error.message
            );
        }
    }

    // =========== FIND ACTIVOS ===========
    async findActivos(): Promise<BaseResponseDto<TipoContrato[]>> {
        try {
            const tiposContratoActivos = await this.tipoContratoRepository.find({
                where: {
                    activo: true,
                    deletedAt: IsNull()
                },
                order: { nombre: 'ASC' }
            });

            return BaseResponseDto.success(
                tiposContratoActivos,
                `${tiposContratoActivos.length} tipos de contrato activos encontrados`,
                HttpStatus.OK
            );

        } catch (error) {
            return BaseResponseDto.error(
                'Error al obtener tipos de contrato activos: ' + error.message,
                HttpStatus.INTERNAL_SERVER_ERROR,
                error.message
            );
        }
    }
}
