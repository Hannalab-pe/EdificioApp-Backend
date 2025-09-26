import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { SesionUsuario } from '../../../entities/SesionUsuario';
import {
  ISesionUsuarioService,
  CreateSesionUsuarioDto,
  UpdateSesionUsuarioDto,
  SesionUsuarioQuery,
} from '../../Interfaces/sesion-usuario/isesion-usuario.service';

@Injectable()
export class SesionUsuarioService implements ISesionUsuarioService {
  constructor(
    @InjectRepository(SesionUsuario)
    private readonly sesionRepository: Repository<SesionUsuario>,
  ) {}

  async create(data: CreateSesionUsuarioDto): Promise<SesionUsuario> {
    const sesion = this.sesionRepository.create({
      ...data,
      activa: data.activa ?? true,
    });

    return await this.sesionRepository.save(sesion);
  }

  async findAll(query: SesionUsuarioQuery = {}): Promise<{
    sesiones: SesionUsuario[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const {
      page = 1,
      limit = 10,
      usuarioId,
      activa,
      dispositivo,
      ipAddress,
    } = query;

    const queryBuilder = this.sesionRepository
      .createQueryBuilder('sesion')
      .leftJoinAndSelect('sesion.usuario', 'usuario');

    // Filtros
    if (usuarioId) {
      queryBuilder.andWhere('sesion.usuarioId = :usuarioId', { usuarioId });
    }

    if (activa !== undefined) {
      queryBuilder.andWhere('sesion.activa = :activa', { activa });
    }

    if (dispositivo) {
      queryBuilder.andWhere('sesion.dispositivo ILIKE :dispositivo', {
        dispositivo: `%${dispositivo}%`,
      });
    }

    if (ipAddress) {
      queryBuilder.andWhere('sesion.ipAddress = :ipAddress', { ipAddress });
    }

    // Paginación
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    // Ordenamiento
    queryBuilder.orderBy('sesion.createdAt', 'DESC');

    const [sesiones, total] = await queryBuilder.getManyAndCount();
    const totalPages = Math.ceil(total / limit);

    return {
      sesiones,
      total,
      page,
      totalPages,
    };
  }

  async findOne(id: string): Promise<SesionUsuario> {
    const sesion = await this.sesionRepository.findOne({
      where: { id },
      relations: ['usuario'],
    });

    if (!sesion) {
      throw new NotFoundException('Sesión no encontrada');
    }

    return sesion;
  }

  async findByToken(tokenHash: string): Promise<SesionUsuario> {
    const sesion = await this.sesionRepository.findOne({
      where: { tokenHash, activa: true },
      relations: ['usuario'],
    });

    if (!sesion) {
      throw new NotFoundException('Sesión no encontrada o inactiva');
    }

    // Verificar si la sesión ha expirado
    if (sesion.expiraEn < new Date()) {
      await this.deactivateSession(sesion.id);
      throw new NotFoundException('Sesión expirada');
    }

    return sesion;
  }

  async findActiveByUserId(usuarioId: string): Promise<SesionUsuario[]> {
    return await this.sesionRepository.find({
      where: {
        usuarioId,
        activa: true,
      },
      order: { createdAt: 'DESC' },
    });
  }

  async update(
    id: string,
    data: UpdateSesionUsuarioDto,
  ): Promise<SesionUsuario> {
    const sesion = await this.findOne(id);

    Object.assign(sesion, data);

    return await this.sesionRepository.save(sesion);
  }

  async remove(id: string): Promise<void> {
    const sesion = await this.findOne(id);
    await this.sesionRepository.remove(sesion);
  }

  async deactivateSession(id: string): Promise<void> {
    const sesion = await this.findOne(id);
    sesion.activa = false;
    await this.sesionRepository.save(sesion);
  }

  async deactivateAllUserSessions(usuarioId: string): Promise<void> {
    await this.sesionRepository.update(
      { usuarioId, activa: true },
      { activa: false },
    );
  }

  async cleanExpiredSessions(): Promise<void> {
    await this.sesionRepository.update(
      {
        activa: true,
        expiraEn: LessThan(new Date()),
      },
      { activa: false },
    );
  }
}
