import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../../../entities/Usuario';
import {
  IUsuarioService,
  CreateUsuarioDto,
  UpdateUsuarioDto,
  UsuarioQuery,
} from '../../Interfaces/usuario/iusuario.service';

@Injectable()
export class UsuarioService implements IUsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async create(data: CreateUsuarioDto): Promise<Usuario> {
    // Verificar si el email ya existe
    const existingUser = await this.usuarioRepository.findOne({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    // Verificar si el documento ya está asociado a otro usuario
    const userWithDocument = await this.usuarioRepository.findOne({
      where: { documentoIdentidadId: data.documentoIdentidadId },
    });

    if (userWithDocument) {
      throw new ConflictException(
        'El documento de identidad ya está asociado a otro usuario',
      );
    }

    const usuario = this.usuarioRepository.create({
      ...data,
      activo: data.activo ?? true,
      debeCambiarPassword: data.debeCambiarPassword ?? false,
      intentosFallidos: 0,
    });

    return await this.usuarioRepository.save(usuario);
  }

  async findAll(query: UsuarioQuery = {}): Promise<{
    usuarios: Usuario[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const { page = 1, limit = 10, email, activo, rolId, nombre } = query;

    const queryBuilder = this.usuarioRepository
      .createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.documentoIdentidad', 'documento')
      .leftJoinAndSelect('usuario.rol', 'rol');

    // Filtros
    if (email) {
      queryBuilder.andWhere('usuario.email ILIKE :email', {
        email: `%${email}%`,
      });
    }

    if (activo !== undefined) {
      queryBuilder.andWhere('usuario.activo = :activo', { activo });
    }

    if (rolId) {
      queryBuilder.andWhere('usuario.rolId = :rolId', { rolId });
    }

    if (nombre) {
      queryBuilder.andWhere(
        '(usuario.nombre ILIKE :nombre OR usuario.apellidos ILIKE :nombre)',
        { nombre: `%${nombre}%` },
      );
    }

    // Paginación
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    // Ordenamiento
    queryBuilder.orderBy('usuario.createdAt', 'DESC');

    const [usuarios, total] = await queryBuilder.getManyAndCount();
    const totalPages = Math.ceil(total / limit);

    return {
      usuarios,
      total,
      page,
      totalPages,
    };
  }

  async findOne(id: string): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id },
      relations: ['documentoIdentidad', 'rol'],
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return usuario;
  }

  async findByEmail(email: string): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { email },
      relations: ['documentoIdentidad', 'rol'],
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return usuario;
  }

  async update(id: string, data: UpdateUsuarioDto): Promise<Usuario> {
    const usuario = await this.findOne(id);

    // Si se está cambiando el email, verificar que no exista
    if (data.email && data.email !== usuario.email) {
      const existingUser = await this.usuarioRepository.findOne({
        where: { email: data.email },
      });

      if (existingUser) {
        throw new ConflictException('El email ya está registrado');
      }
    }

    // Si se está cambiando el documento, verificar que no esté asociado
    if (
      data.documentoIdentidadId &&
      data.documentoIdentidadId !== usuario.documentoIdentidadId
    ) {
      const userWithDocument = await this.usuarioRepository.findOne({
        where: { documentoIdentidadId: data.documentoIdentidadId },
      });

      if (userWithDocument) {
        throw new ConflictException(
          'El documento de identidad ya está asociado a otro usuario',
        );
      }
    }

    Object.assign(usuario, data);
    usuario.updatedAt = new Date();

    return await this.usuarioRepository.save(usuario);
  }

  async remove(id: string): Promise<void> {
    const usuario = await this.findOne(id);
    await this.usuarioRepository.remove(usuario);
  }

  async softDelete(id: string): Promise<void> {
    const usuario = await this.findOne(id);
    usuario.activo = false;
    usuario.updatedAt = new Date();
    await this.usuarioRepository.save(usuario);
  }

  async updateLastAccess(id: string): Promise<void> {
    await this.usuarioRepository.update(id, {
      ultimoAcceso: new Date(),
      updatedAt: new Date(),
    });
  }

  async incrementFailedAttempts(id: string): Promise<void> {
    const usuario = await this.findOne(id);
    usuario.intentosFallidos = (usuario.intentosFallidos || 0) + 1;
    usuario.updatedAt = new Date();

    // Bloquear si supera 5 intentos fallidos
    if (usuario.intentosFallidos >= 5) {
      usuario.bloqueadoHasta = new Date(Date.now() + 30 * 60 * 1000); // 30 minutos
    }

    await this.usuarioRepository.save(usuario);
  }

  async resetFailedAttempts(id: string): Promise<void> {
    await this.usuarioRepository.update(id, {
      intentosFallidos: 0,
      bloqueadoHasta: null,
      updatedAt: new Date(),
    });
  }

  async blockUser(id: string, until: Date): Promise<void> {
    const usuario = await this.findOne(id);
    usuario.bloqueadoHasta = until;
    usuario.updatedAt = new Date();
    await this.usuarioRepository.save(usuario);
  }
}
