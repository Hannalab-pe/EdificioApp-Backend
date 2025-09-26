import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Inject
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Usuario } from '../../../entities/Usuario';
import {
  CreateUsuarioDto,
  UpdateUsuarioDto,
} from '../../../dto';
import { IUsuarioService, UsuarioQuery } from '../../Interfaces/usuario/iusuario.service';
import { IDocumentoIdentidadService } from '../../Interfaces/documento-identidad/idocumento-identidad.service';

@Injectable()
export class UsuarioService implements IUsuarioService {
  private readonly logger = new Logger(UsuarioService.name);

  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
    @Inject('IDocumentoIdentidadService')
    private readonly documentoIdentidadService: IDocumentoIdentidadService,
  ) { }

  async create(data: CreateUsuarioDto): Promise<Usuario> {
    try {
      // Verificar si el email ya existe
      const existingUsuario = await this.usuarioRepository.findOne({
        where: { email: data.email }
      });

      if (existingUsuario) {
        this.logger.warn(`Email ${data.email} ya está registrado`);
        throw new ConflictException('El email ya está registrado');
      }

      // Crear el nuevo usuario con los campos correctos
      const usuario = this.usuarioRepository.create({
        documentoIdentidadId: data.documentoIdentidadId,
        email: data.email,
        passwordHash: data.passwordHash,
        nombre: data.nombre,
        apellidos: data.apellidos,
        telefono: data.telefono || null,
        rolId: data.rolId,
        activo: data.activo !== undefined ? data.activo : true,
        debeCambiarPassword: data.debeCambiarPassword || false,
        intentosFallidos: 0,
        estadoTrabajador: 'none',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      return await this.usuarioRepository.save(usuario);
    } catch (error) {
      this.logger.error('Error al crear usuario', error instanceof Error ? error.stack : error);
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Error al crear usuario');
    }
  }

  async findAll(query?: UsuarioQuery): Promise<{
    usuarios: Usuario[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const page = query?.page || 1;
      const limit = query?.limit || 10;
      const skip = (page - 1) * limit;

      const queryBuilder = this.usuarioRepository.createQueryBuilder('usuario')
        .leftJoinAndSelect('usuario.documentoIdentidad', 'documentoIdentidad')
        .leftJoinAndSelect('usuario.rol', 'rol');

      // Aplicar filtros
      if (query?.activo !== undefined) {
        queryBuilder.andWhere('usuario.activo = :activo', { activo: query.activo });
      }

      if (query?.rolId) {
        queryBuilder.andWhere('usuario.rolId = :rolId', { rolId: query.rolId });
      }

      if (query?.email) {
        queryBuilder.andWhere('usuario.email ILIKE :email', { email: `%${query.email}%` });
      }

      if (query?.nombre) {
        queryBuilder.andWhere(
          '(usuario.nombre ILIKE :nombre OR usuario.apellidos ILIKE :nombre)',
          { nombre: `%${query.nombre}%` }
        );
      }

      // Obtener total y resultados paginados
      const [usuarios, total] = await queryBuilder
        .skip(skip)
        .take(limit)
        .getManyAndCount();

      const totalPages = Math.ceil(total / limit);

      return {
        usuarios,
        total,
        page,
        totalPages,
      };
    } catch (error) {
      this.logger.error('Error al listar usuarios', error instanceof Error ? error.stack : error);
      throw new BadRequestException('Error al obtener usuarios');
    }
  }

  async findOne(id: string): Promise<Usuario | null> {
    try {
      const usuario = await this.usuarioRepository.findOne({
        where: { id },
        relations: ['documentoIdentidad', 'rol']
      });

      return usuario || null;
    } catch (error) {
      this.logger.error('Error al obtener usuario', error instanceof Error ? error.stack : error);
      throw new BadRequestException('Error al obtener usuario');
    }
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    try {
      const usuario = await this.usuarioRepository.findOne({
        where: { email },
        relations: ['documentoIdentidad', 'rol']
      });

      return usuario || null;
    } catch (error) {
      this.logger.error('Error al buscar usuario por email', error instanceof Error ? error.stack : error);
      throw new BadRequestException('Error al buscar usuario');
    }
  }

  async update(id: string, data: UpdateUsuarioDto): Promise<Usuario> {
    try {
      const usuario = await this.findOne(id);
      if (!usuario) {
        throw new NotFoundException('Usuario no encontrado');
      }

      // Verificar email único si se está cambiando
      if (data.email && data.email !== usuario.email) {
        const existingUsuario = await this.usuarioRepository.findOne({
          where: { email: data.email }
        });

        if (existingUsuario) {
          this.logger.warn(`Email ${data.email} ya está registrado`);
          throw new ConflictException('El email ya está registrado');
        }
      }

      // Actualizar campos
      Object.assign(usuario, {
        ...data,
        updatedAt: new Date()
      });

      return await this.usuarioRepository.save(usuario);
    } catch (error) {
      this.logger.error('Error al actualizar usuario', error instanceof Error ? error.stack : error);
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Error al actualizar usuario');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const usuario = await this.findOne(id);
      if (!usuario) {
        throw new NotFoundException('Usuario no encontrado');
      }

      await this.usuarioRepository.remove(usuario);
    } catch (error) {
      this.logger.error('Error al eliminar usuario', error instanceof Error ? error.stack : error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al eliminar usuario');
    }
  }

  async softDelete(id: string): Promise<void> {
    try {
      const usuario = await this.findOne(id);
      if (!usuario) {
        throw new NotFoundException('Usuario no encontrado');
      }

      usuario.activo = false;
      usuario.updatedAt = new Date();
      await this.usuarioRepository.save(usuario);
    } catch (error) {
      this.logger.error('Error al desactivar usuario', error instanceof Error ? error.stack : error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al desactivar usuario');
    }
  }

  async updateLastAccess(id: string): Promise<void> {
    try {
      const usuario = await this.findOne(id);
      if (!usuario) {
        throw new NotFoundException('Usuario no encontrado');
      }

      usuario.ultimoAcceso = new Date();
      usuario.updatedAt = new Date();
      await this.usuarioRepository.save(usuario);
    } catch (error) {
      this.logger.error('Error al actualizar ultimo acceso', error instanceof Error ? error.stack : error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al actualizar último acceso');
    }
  }

  async incrementFailedAttempts(id: string): Promise<void> {
    try {
      const usuario = await this.findOne(id);
      if (!usuario) {
        throw new NotFoundException('Usuario no encontrado');
      }

      usuario.intentosFallidos = (usuario.intentosFallidos || 0) + 1;

      // Auto-bloqueo después de 5 intentos fallidos
      if (usuario.intentosFallidos >= 5) {
        usuario.bloqueadoHasta = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos
      }

      usuario.updatedAt = new Date();
      await this.usuarioRepository.save(usuario);
    } catch (error) {
      this.logger.error('Error al incrementar intentos fallidos', error instanceof Error ? error.stack : error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al actualizar intentos fallidos');
    }
  }

  async resetFailedAttempts(id: string): Promise<void> {
    try {
      const usuario = await this.findOne(id);
      if (!usuario) {
        throw new NotFoundException('Usuario no encontrado');
      }

      usuario.intentosFallidos = 0;
      usuario.bloqueadoHasta = null;
      usuario.updatedAt = new Date();
      await this.usuarioRepository.save(usuario);
    } catch (error) {
      this.logger.error('Error al reiniciar intentos fallidos', error instanceof Error ? error.stack : error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al reiniciar intentos fallidos');
    }
  }

  async blockUser(id: string, until: Date): Promise<void> {
    try {
      const usuario = await this.findOne(id);
      if (!usuario) {
        throw new NotFoundException('Usuario no encontrado');
      }

      usuario.bloqueadoHasta = until;
      usuario.updatedAt = new Date();
      await this.usuarioRepository.save(usuario);
    } catch (error) {
      this.logger.error('Error al bloquear usuario', error instanceof Error ? error.stack : error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al bloquear usuario');
    }
  }
}