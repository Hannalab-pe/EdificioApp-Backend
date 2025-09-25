import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Permiso } from '../entities/permiso.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PermissionResponseDto } from './dto/permission-response.dto';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permiso)
    private permisoRepository: Repository<Permiso>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto): Promise<PermissionResponseDto> {
    const { modulo, accion, recurso } = createPermissionDto;

    // Verificar si ya existe un permiso con la misma combinación
    const whereCondition = recurso
      ? { modulo, accion, recurso }
      : { modulo, accion, recurso: IsNull() };

    const existingPermiso = await this.permisoRepository.findOne({
      where: whereCondition
    });

    if (existingPermiso) {
      throw new ConflictException('Ya existe un permiso con esa combinación de módulo, acción y recurso');
    }

    // Crear el permiso
    const permiso = await this.permisoRepository.save(createPermissionDto);

    return this.mapToPermissionResponse(permiso);
  }

  async findAll(): Promise<PermissionResponseDto[]> {
    const permisos = await this.permisoRepository.find({
      where: { activo: true },
      order: { modulo: 'ASC', accion: 'ASC' },
    });

    return permisos.map(permiso => this.mapToPermissionResponse(permiso));
  }

  async findOne(id: number): Promise<PermissionResponseDto> {
    const permiso = await this.permisoRepository.findOne({
      where: { id, activo: true },
    });

    if (!permiso) {
      throw new NotFoundException('Permiso no encontrado');
    }

    return this.mapToPermissionResponse(permiso);
  }

  async findByModulo(modulo: string): Promise<PermissionResponseDto[]> {
    const permisos = await this.permisoRepository.find({
      where: { modulo, activo: true },
      order: { accion: 'ASC' },
    });

    return permisos.map(permiso => this.mapToPermissionResponse(permiso));
  }

  async update(id: number, updatePermissionDto: UpdatePermissionDto): Promise<PermissionResponseDto> {
    const permiso = await this.permisoRepository.findOne({
      where: { id, activo: true },
    });

    if (!permiso) {
      throw new NotFoundException('Permiso no encontrado');
    }

    const { modulo, accion, recurso } = updatePermissionDto;

    // Verificar si la nueva combinación ya existe (excluyendo el permiso actual)
    if (modulo || accion || recurso !== undefined) {
      const newModulo = modulo || permiso.modulo;
      const newAccion = accion || permiso.accion;
      const newRecurso = recurso !== undefined ? recurso : permiso.recurso;

      const whereConditionUpdate = newRecurso
        ? { modulo: newModulo, accion: newAccion, recurso: newRecurso }
        : { modulo: newModulo, accion: newAccion, recurso: IsNull() };

      const existingPermiso = await this.permisoRepository.findOne({
        where: whereConditionUpdate
      });

      if (existingPermiso && existingPermiso.id !== id) {
        throw new ConflictException('Ya existe un permiso con esa combinación de módulo, acción y recurso');
      }
    }

    // Actualizar el permiso
    await this.permisoRepository.update(id, updatePermissionDto);

    // Cargar permiso actualizado
    const permisoActualizado = await this.permisoRepository.findOne({
      where: { id },
    });

    if (!permisoActualizado) {
      throw new BadRequestException('Error al actualizar el permiso');
    }

    return this.mapToPermissionResponse(permisoActualizado);
  }

  async remove(id: number): Promise<{ message: string }> {
    const permiso = await this.permisoRepository.findOne({
      where: { id, activo: true },
    });

    if (!permiso) {
      throw new NotFoundException('Permiso no encontrado');
    }

    // Verificar si hay roles usando este permiso
    const rolesCount = await this.permisoRepository
      .createQueryBuilder('permiso')
      .leftJoin('permiso.rolPermisos', 'rolPermiso')
      .where('permiso.id = :id AND rolPermiso.concedido = true', { id })
      .getCount();

    if (rolesCount > 0) {
      throw new BadRequestException('No se puede eliminar el permiso porque está asignado a roles activos');
    }

    // Soft delete
    await this.permisoRepository.update(id, { activo: false });

    return { message: 'Permiso eliminado exitosamente' };
  }

  private mapToPermissionResponse(permiso: Permiso): PermissionResponseDto {
    return {
      id: permiso.id,
      modulo: permiso.modulo,
      accion: permiso.accion,
      recurso: permiso.recurso,
      descripcion: permiso.descripcion,
      activo: permiso.activo,
      createdAt: permiso.createdAt,
    };
  }
}