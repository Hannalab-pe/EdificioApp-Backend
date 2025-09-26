import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permiso } from '../../../entities/Permiso';
import {
  IPermisoService,
  CreatePermisoDto,
  UpdatePermisoDto,
  PermisoQuery,
} from '../../Interfaces/permiso/ipermiso.service';

@Injectable()
export class PermisoService implements IPermisoService {
  constructor(
    @InjectRepository(Permiso)
    private readonly permisoRepository: Repository<Permiso>,
  ) {}

  async create(data: CreatePermisoDto): Promise<Permiso> {
    // Verificar duplicados
    const whereClause: any = {
      modulo: data.modulo,
      accion: data.accion,
    };

    if (data.recurso) {
      whereClause.recurso = data.recurso;
    } else {
      whereClause.recurso = null;
    }

    const existingPermiso = await this.permisoRepository.findOne({
      where: whereClause,
    });

    if (existingPermiso) {
      throw new ConflictException(
        'Ya existe un permiso con el mismo módulo, acción y recurso',
      );
    }

    const permiso = this.permisoRepository.create({
      ...data,
      activo: data.activo ?? true,
    });

    return await this.permisoRepository.save(permiso);
  }

  async findAll(query: PermisoQuery = {}): Promise<{
    permisos: Permiso[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const { page = 1, limit = 10, modulo, accion, recurso, activo } = query;

    const queryBuilder = this.permisoRepository.createQueryBuilder('permiso');

    if (modulo) {
      queryBuilder.andWhere('permiso.modulo ILIKE :modulo', {
        modulo: `%${modulo}%`,
      });
    }

    if (accion) {
      queryBuilder.andWhere('permiso.accion ILIKE :accion', {
        accion: `%${accion}%`,
      });
    }

    if (recurso) {
      queryBuilder.andWhere('permiso.recurso ILIKE :recurso', {
        recurso: `%${recurso}%`,
      });
    }

    if (activo !== undefined) {
      queryBuilder.andWhere('permiso.activo = :activo', { activo });
    }

    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);
    queryBuilder
      .orderBy('permiso.modulo', 'ASC')
      .addOrderBy('permiso.accion', 'ASC');

    const [permisos, total] = await queryBuilder.getManyAndCount();
    const totalPages = Math.ceil(total / limit);

    return { permisos, total, page, totalPages };
  }

  async findOne(id: string): Promise<Permiso> {
    const permiso = await this.permisoRepository.findOne({
      where: { id },
    });

    if (!permiso) {
      throw new NotFoundException('Permiso no encontrado');
    }

    return permiso;
  }

  async update(id: string, data: UpdatePermisoDto): Promise<Permiso> {
    const permiso = await this.findOne(id);

    Object.assign(permiso, data);
    return await this.permisoRepository.save(permiso);
  }

  async remove(id: string): Promise<void> {
    const permiso = await this.findOne(id);
    await this.permisoRepository.remove(permiso);
  }

  async findByName(modulo: string): Promise<Permiso[]> {
    return await this.permisoRepository.find({
      where: { modulo },
      order: { accion: 'ASC' },
    });
  }

  async softDelete(id: string): Promise<void> {
    const permiso = await this.findOne(id);
    permiso.activo = false;
    await this.permisoRepository.save(permiso);
  }
}
