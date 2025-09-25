import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol, Permiso, RolPermiso, NivelAcceso } from '../entities';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleWithPermissionsResponseDto } from './dto/role-with-permissions-response.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Rol)
    private rolRepository: Repository<Rol>,
    @InjectRepository(Permiso)
    private permisoRepository: Repository<Permiso>,
    @InjectRepository(RolPermiso)
    private rolPermisoRepository: Repository<RolPermiso>,
  ) {}

  async findAll(): Promise<RoleWithPermissionsResponseDto[]> {
    const roles = await this.rolRepository.find({
      where: { activo: true },
      relations: ['rolPermisos', 'rolPermisos.permiso'],
      order: { nombre: 'ASC' },
    });

    return roles.map(rol => this.mapToRolResponse(rol));
  }

  async findOne(id: number): Promise<RoleWithPermissionsResponseDto> {
    const rol = await this.rolRepository.findOne({
      where: { id, activo: true },
      relations: ['rolPermisos', 'rolPermisos.permiso'],
    });

    if (!rol) {
      throw new NotFoundException('Rol no encontrado');
    }

    return this.mapToRolResponse(rol);
  }

  async create(createRolDto: CreateRoleDto): Promise<RoleWithPermissionsResponseDto> {
    const { nombre, descripcion, nivelAcceso, permisosIds } = createRolDto;

    // Verificar si el nombre ya existe
    const existingRol = await this.rolRepository.findOne({ where: { nombre } });
    if (existingRol) {
      throw new ConflictException('Ya existe un rol con ese nombre');
    }

    // Crear el rol
    const rol = await this.rolRepository.save({
      nombre,
      descripcion,
      nivelAcceso: nivelAcceso as NivelAcceso,
    });

    // Asignar permisos si se proporcionan
    if (permisosIds && permisosIds.length > 0) {
      await this.assignPermisosToRol(rol.id, permisosIds);
    }

    // Cargar rol completo con permisos
    const rolCompleto = await this.rolRepository.findOne({
      where: { id: rol.id },
      relations: ['rolPermisos', 'rolPermisos.permiso'],
    });

    if (!rolCompleto) {
      throw new BadRequestException('Error al crear el rol');
    }

    return this.mapToRolResponse(rolCompleto);
  }

  async update(id: number, updateRolDto: UpdateRoleDto): Promise<RoleWithPermissionsResponseDto> {
    const rol = await this.rolRepository.findOne({
      where: { id, activo: true },
      relations: ['rolPermisos', 'rolPermisos.permiso'],
    });

    if (!rol) {
      throw new NotFoundException('Rol no encontrado');
    }

    const { permisosIds, ...updateData } = updateRolDto;

    // Verificar si el nombre ya existe (excluyendo el rol actual)
    if (updateData.nombre) {
      const existingRol = await this.rolRepository.findOne({
        where: { nombre: updateData.nombre }
      });
      if (existingRol && existingRol.id !== id) {
        throw new ConflictException('Ya existe un rol con ese nombre');
      }
    }

    // Actualizar rol
    const updatePayload: any = { ...updateData };
    if (updateData.nivelAcceso) {
      updatePayload.nivelAcceso = updateData.nivelAcceso as NivelAcceso;
    }
    await this.rolRepository.update(id, updatePayload);

    // Actualizar permisos si se proporcionan
    if (permisosIds !== undefined) {
      await this.updateRolPermisos(id, permisosIds);
    }

    // Cargar rol actualizado
    const rolActualizado = await this.rolRepository.findOne({
      where: { id },
      relations: ['rolPermisos', 'rolPermisos.permiso'],
    });

    if (!rolActualizado) {
      throw new BadRequestException('Error al actualizar el rol');
    }

    return this.mapToRolResponse(rolActualizado);
  }

  async remove(id: number): Promise<{ message: string }> {
    const rol = await this.rolRepository.findOne({ where: { id, activo: true } });

    if (!rol) {
      throw new NotFoundException('Rol no encontrado');
    }

    // Verificar si hay usuarios usando este rol
    const usuariosCount = await this.rolRepository
      .createQueryBuilder('rol')
      .leftJoin('rol.usuarios', 'usuario')
      .where('rol.id = :id AND usuario.activo = true', { id })
      .getCount();

    if (usuariosCount > 0) {
      throw new BadRequestException('No se puede eliminar el rol porque tiene usuarios asignados');
    }

    // Soft delete
    await this.rolRepository.update(id, { activo: false });

    return { message: 'Rol eliminado exitosamente' };
  }

  async assignPermisosToRol(rolId: number, permisosIds: number[]): Promise<void> {
    // Verificar que el rol existe
    const rol = await this.rolRepository.findOne({ where: { id: rolId, activo: true } });
    if (!rol) {
      throw new NotFoundException('Rol no encontrado');
    }

    // Verificar que todos los permisos existen
    for (const permisoId of permisosIds) {
      const permiso = await this.permisoRepository.findOne({ where: { id: permisoId, activo: true } });
      if (!permiso) {
        throw new NotFoundException(`Permiso con ID ${permisoId} no encontrado`);
      }
    }

    // Eliminar permisos existentes
    await this.rolPermisoRepository.delete({ rolId });

    // Crear nuevos permisos
    const rolPermisos = permisosIds.map(permisoId => ({
      rolId,
      permisoId,
      concedido: true,
    }));

    await this.rolPermisoRepository.save(rolPermisos);
  }

  async updateRolPermisos(rolId: number, permisosIds: number[]): Promise<void> {
    if (permisosIds.length === 0) {
      // Eliminar todos los permisos
      await this.rolPermisoRepository.delete({ rolId });
    } else {
      await this.assignPermisosToRol(rolId, permisosIds);
    }
  }

  private mapToRolResponse(rol: Rol): RoleWithPermissionsResponseDto {
    return {
      id: rol.id,
      nombre: rol.nombre,
      descripcion: rol.descripcion,
      nivelAcceso: rol.nivelAcceso,
      activo: rol.activo,
      createdAt: rol.createdAt,
      updatedAt: rol.updatedAt,
      permisos: rol.rolPermisos?.map(rp => ({
        id: rp.permiso.id,
        modulo: rp.permiso.modulo,
        accion: rp.permiso.accion,
        recurso: rp.permiso.recurso,
        descripcion: rp.permiso.descripcion,
        activo: rp.permiso.activo,
      })) || [],
    };
  }
}