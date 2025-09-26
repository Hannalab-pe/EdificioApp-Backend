import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol, NivelAcceso } from '../../../entities/Rol';
import {
  IRolService,
  CreateRolDto,
  UpdateRolDto,
  RolQuery,
  RolResponseDto,
  RolListResponseDto,
} from '../../Interfaces/rol/irol.service';

@Injectable()
export class RolService implements IRolService {
  constructor(
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
  ) {}

  async create(data: CreateRolDto): Promise<RolResponseDto> {
    // Verificar si el nombre ya existe
    const existingRol = await this.rolRepository.findOne({
      where: { nombre: data.nombre },
    });

    if (existingRol) {
      throw new ConflictException('Ya existe un rol con ese nombre');
    }

    const rol = this.rolRepository.create({
      ...data,
      activo: data.activo ?? true,
    });

    const savedRol = await this.rolRepository.save(rol);
    return new RolResponseDto(savedRol);
  }

  async findAll(query: RolQuery = {}): Promise<RolListResponseDto> {
    const { page = 1, limit = 10, nombre, nivelAcceso, activo } = query;

    const queryBuilder = this.rolRepository.createQueryBuilder('rol');

    // Filtros
    if (nombre) {
      queryBuilder.andWhere('rol.nombre ILIKE :nombre', {
        nombre: `%${nombre}%`,
      });
    }

    if (nivelAcceso) {
      queryBuilder.andWhere('rol.nivelAcceso = :nivelAcceso', { nivelAcceso });
    }

    if (activo !== undefined) {
      queryBuilder.andWhere('rol.activo = :activo', { activo });
    }

    // Paginación
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    // Ordenamiento
    queryBuilder.orderBy('rol.createdAt', 'DESC');

    const [roles, total] = await queryBuilder.getManyAndCount();
    const totalPages = Math.ceil(total / limit);

    return new RolListResponseDto({
      roles: roles.map((rol) => new RolResponseDto(rol)),
      total,
      page,
      totalPages,
    });
  }

  async findOne(id: string): Promise<RolResponseDto> {
    const rol = await this.rolRepository.findOne({
      where: { id },
    });

    if (!rol) {
      throw new NotFoundException('Rol no encontrado');
    }

    return new RolResponseDto(rol);
  }

  async findByName(nombre: string): Promise<RolResponseDto> {
    const rol = await this.rolRepository.findOne({
      where: { nombre },
    });

    if (!rol) {
      throw new NotFoundException('Rol no encontrado');
    }

    return new RolResponseDto(rol);
  }

  async update(id: string, data: UpdateRolDto): Promise<RolResponseDto> {
    // Primero buscar el rol en la base de datos directamente
    const rol = await this.rolRepository.findOne({
      where: { id },
    });

    if (!rol) {
      throw new NotFoundException('Rol no encontrado');
    }

    // Si se está cambiando el nombre, verificar que no exista
    if (data.nombre && data.nombre !== rol.nombre) {
      const existingRol = await this.rolRepository.findOne({
        where: { nombre: data.nombre },
      });

      if (existingRol) {
        throw new ConflictException('Ya existe un rol con ese nombre');
      }
    }

    Object.assign(rol, data);
    rol.updatedAt = new Date();

    const updatedRol = await this.rolRepository.save(rol);
    return new RolResponseDto(updatedRol);
  }

  async remove(id: string): Promise<void> {
    const rol = await this.rolRepository.findOne({
      where: { id },
    });

    if (!rol) {
      throw new NotFoundException('Rol no encontrado');
    }

    await this.rolRepository.remove(rol);
  }

  async softDelete(id: string): Promise<void> {
    const rol = await this.rolRepository.findOne({
      where: { id },
    });

    if (!rol) {
      throw new NotFoundException('Rol no encontrado');
    }

    rol.activo = false;
    rol.updatedAt = new Date();
    await this.rolRepository.save(rol);
  }

  async findByNivelAcceso(nivelAcceso: NivelAcceso): Promise<RolResponseDto[]> {
    const roles = await this.rolRepository.find({
      where: {
        nivelAcceso,
        activo: true,
      },
      order: { nombre: 'ASC' },
    });

    return roles.map((rol) => new RolResponseDto(rol));
  }
}
