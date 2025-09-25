import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Usuario, DocumentoIdentidad, Rol, TipoDocumento } from '../entities';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from '../dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    @InjectRepository(DocumentoIdentidad)
    private documentoRepository: Repository<DocumentoIdentidad>,
    @InjectRepository(Rol)
    private rolRepository: Repository<Rol>,
  ) {}

  async findAll(options: {
    page: number;
    limit: number;
    search?: string;
    activo?: boolean;
  }): Promise<{
    users: UserResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { page, limit, search, activo } = options;
    const skip = (page - 1) * limit;

    const queryBuilder = this.usuarioRepository
      .createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.rol', 'rol')
      .leftJoinAndSelect('usuario.documentoIdentidad', 'documentoIdentidad')
      .where('usuario.activo = :activo', { activo: activo !== undefined ? activo : true });

    if (search) {
      queryBuilder.andWhere(
        '(usuario.nombre ILIKE :search OR usuario.apellidos ILIKE :search OR usuario.email ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    const [usuarios, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('usuario.createdAt', 'DESC')
      .getManyAndCount();

    const totalPages = Math.ceil(total / limit);

    return {
      users: usuarios.map(user => this.mapToUserResponse(user)),
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(id: number): Promise<UserResponseDto> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id, activo: true },
      relations: ['rol', 'documentoIdentidad'],
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return this.mapToUserResponse(usuario);
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const {
      email,
      password,
      nombre,
      apellidos,
      telefono,
      rolId,
      tipoDocumento,
      numeroDocumento,
      paisEmision = 'PE',
      fechaEmision,
      fechaVencimiento,
    } = createUserDto;

    // Verificar si el email ya existe
    const existingUser = await this.usuarioRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    // Verificar si el documento ya existe
    const existingDoc = await this.documentoRepository.findOne({
      where: { tipo: tipoDocumento as TipoDocumento, numero: numeroDocumento }
    });
    if (existingDoc) {
      throw new ConflictException('El documento ya está registrado');
    }

    // Verificar rol
    const rol = await this.rolRepository.findOne({ where: { id: rolId, activo: true } });
    if (!rol) {
      throw new BadRequestException('Rol no encontrado o inactivo');
    }

    // Crear documento de identidad
    const documentoIdentidad = await this.documentoRepository.save({
      tipo: tipoDocumento as TipoDocumento,
      numero: numeroDocumento,
      paisEmision,
      fechaEmision: fechaEmision ? new Date(fechaEmision) : undefined,
      fechaVencimiento: fechaVencimiento ? new Date(fechaVencimiento) : undefined,
    });

    // Hash de la contraseña
    const passwordHash = await bcrypt.hash(password, 12);

    // Crear usuario
    const usuario = await this.usuarioRepository.save({
      documentoIdentidadId: documentoIdentidad.id_documento_identidad,
      email,
      passwordHash,
      nombre,
      apellidos,
      telefono,
      rolId: rol.id,
      debeCambiarPassword: true, // Forzar cambio de contraseña en primer login
    });

    // Cargar usuario completo
    const usuarioCompleto = await this.usuarioRepository.findOne({
      where: { id: usuario.id },
      relations: ['rol', 'documentoIdentidad'],
    });

    if (!usuarioCompleto) {
      throw new BadRequestException('Error al crear el usuario');
    }

    return this.mapToUserResponse(usuarioCompleto);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id, activo: true },
      relations: ['rol', 'documentoIdentidad'],
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const { rolId, ...updateData } = updateUserDto;

    // Verificar rol si se proporciona
    if (rolId) {
      const rol = await this.rolRepository.findOne({ where: { id: rolId, activo: true } });
      if (!rol) {
        throw new BadRequestException('Rol no encontrado o inactivo');
      }
      (updateData as any).rolId = rol.id;
    }

    // Actualizar usuario
    await this.usuarioRepository.update(id, updateData);

    // Cargar usuario actualizado
    const usuarioActualizado = await this.usuarioRepository.findOne({
      where: { id },
      relations: ['rol', 'documentoIdentidad'],
    });

    if (!usuarioActualizado) {
      throw new BadRequestException('Error al actualizar el usuario');
    }

    return this.mapToUserResponse(usuarioActualizado);
  }

  async remove(id: number): Promise<{ message: string }> {
    const usuario = await this.usuarioRepository.findOne({ where: { id, activo: true } });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Soft delete - marcar como inactivo
    await this.usuarioRepository.update(id, { activo: false });

    return { message: 'Usuario eliminado exitosamente' };
  }

  async activate(id: number): Promise<{ message: string }> {
    const usuario = await this.usuarioRepository.findOne({ where: { id } });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    await this.usuarioRepository.update(id, {
      activo: true,
      bloqueadoHasta: undefined,
      intentosFallidos: 0
    });

    return { message: 'Usuario activado exitosamente' };
  }

  async deactivate(id: number): Promise<{ message: string }> {
    const usuario = await this.usuarioRepository.findOne({ where: { id, activo: true } });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    await this.usuarioRepository.update(id, { activo: false });

    return { message: 'Usuario desactivado exitosamente' };
  }

  async resetPassword(id: number): Promise<{ message: string }> {
    const usuario = await this.usuarioRepository.findOne({ where: { id, activo: true } });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Generar nueva contraseña temporal
    const tempPassword = Math.random().toString(36).slice(-12) + 'Temp1!';
    const passwordHash = await bcrypt.hash(tempPassword, 12);

    await this.usuarioRepository.update(id, {
      passwordHash,
      debeCambiarPassword: true,
      ultimoAcceso: undefined,
    });

    // TODO: Enviar email con nueva contraseña temporal
    // Por ahora solo retornamos mensaje
    return {
      message: `Contraseña restablecida exitosamente. Nueva contraseña temporal: ${tempPassword}`
    };
  }

  private mapToUserResponse(usuario: Usuario): UserResponseDto {
    return {
      id: usuario.id,
      email: usuario.email,
      nombre: usuario.nombre,
      apellidos: usuario.apellidos,
      telefono: usuario.telefono,
      activo: usuario.activo,
      rol: {
        id: usuario.rol.id,
        nombre: usuario.rol.nombre,
        descripcion: usuario.rol.descripcion,
        nivelAcceso: usuario.rol.nivelAcceso,
        activo: usuario.rol.activo,
      },
      documentoIdentidad: {
        idDocumentoIdentidad: usuario.documentoIdentidad.id_documento_identidad,
        tipo: usuario.documentoIdentidad.tipo,
        numero: usuario.documentoIdentidad.numero,
        paisEmision: usuario.documentoIdentidad.paisEmision,
        fechaEmision: usuario.documentoIdentidad.fechaEmision,
        fechaVencimiento: usuario.documentoIdentidad.fechaVencimiento,
        validado: usuario.documentoIdentidad.validado,
      },
      ultimoAcceso: usuario.ultimoAcceso,
      createdAt: usuario.createdAt,
      updatedAt: usuario.updatedAt,
    };
  }
}