import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolPermiso } from '../../../entities/RolPermiso';
import {
  IRolPermisoService,
  CreateRolPermisoDto,
  UpdateRolPermisoDto,
  RolPermisoQuery,
} from '../../Interfaces/rol-permiso/irol-permiso.service';

@Injectable()
export class RolPermisoService implements IRolPermisoService {
  constructor(
    @InjectRepository(RolPermiso)
    private readonly rolPermisoRepository: Repository<RolPermiso>,
  ) {}

  async create(data: CreateRolPermisoDto): Promise<RolPermiso> {
    // Verificar si ya existe la relación
    const existingRolPermiso = await this.rolPermisoRepository.findOne({
      where: {
        rolId: data.rolId,
        permisoId: data.permisoId,
      },
    });

    if (existingRolPermiso) {
      throw new ConflictException('Esta relación rol-permiso ya existe');
    }

    const rolPermiso = this.rolPermisoRepository.create({
      ...data,
      concedido: data.concedido ?? true,
    });

    return await this.rolPermisoRepository.save(rolPermiso);
  }

  async findAll(query: RolPermisoQuery = {}): Promise<{
    rolPermisos: RolPermiso[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const { page = 1, limit = 10, rolId, permisoId, concedido } = query;

    const queryBuilder = this.rolPermisoRepository
      .createQueryBuilder('rolPermiso')
      .leftJoinAndSelect('rolPermiso.rol', 'rol')
      .leftJoinAndSelect('rolPermiso.permiso', 'permiso');

    // Filtros
    if (rolId) {
      queryBuilder.andWhere('rolPermiso.rolId = :rolId', { rolId });
    }

    if (permisoId) {
      queryBuilder.andWhere('rolPermiso.permisoId = :permisoId', { permisoId });
    }

    if (concedido !== undefined) {
      queryBuilder.andWhere('rolPermiso.concedido = :concedido', { concedido });
    }

    // Paginación
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    // Ordenamiento
    queryBuilder.orderBy('rolPermiso.createdAt', 'DESC');

    const [rolPermisos, total] = await queryBuilder.getManyAndCount();
    const totalPages = Math.ceil(total / limit);

    return {
      rolPermisos,
      total,
      page,
      totalPages,
    };
  }

  async findOne(id: string): Promise<RolPermiso> {
    const rolPermiso = await this.rolPermisoRepository.findOne({
      where: { id },
      relations: ['rol', 'permiso'],
    });

    if (!rolPermiso) {
      throw new NotFoundException('Relación rol-permiso no encontrada');
    }

    return rolPermiso;
  }

  async findByRolId(rolId: string): Promise<RolPermiso[]> {
    return await this.rolPermisoRepository.find({
      where: { rolId },
      relations: ['permiso'],
      order: { createdAt: 'ASC' },
    });
  }

  async findByPermisoId(permisoId: string): Promise<RolPermiso[]> {
    return await this.rolPermisoRepository.find({
      where: { permisoId },
      relations: ['rol'],
      order: { createdAt: 'ASC' },
    });
  }

  async update(id: string, data: UpdateRolPermisoDto): Promise<RolPermiso> {
    const rolPermiso = await this.findOne(id);

    Object.assign(rolPermiso, data);

    return await this.rolPermisoRepository.save(rolPermiso);
  }

  async remove(id: string): Promise<void> {
    const rolPermiso = await this.findOne(id);
    await this.rolPermisoRepository.remove(rolPermiso);
  }

  async removeByRolAndPermiso(rolId: string, permisoId: string): Promise<void> {
    const rolPermiso = await this.rolPermisoRepository.findOne({
      where: { rolId, permisoId },
    });

    if (!rolPermiso) {
      throw new NotFoundException('Relación rol-permiso no encontrada');
    }

    await this.rolPermisoRepository.remove(rolPermiso);
  }
}
