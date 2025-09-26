import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IPerfilPersonaService, PerfilPersonaQuery } from '../../Interfaces/perfil-persona/iperfil-persona.service';
import { PerfilPersona } from '../../../entities/PerfilPersona';
import { SecurityServiceClient } from '../../clients/security-service.client';
import { BaseResponseDto, CreatePerfilPersonaDto, UpdatePerfilPersonaDto, PerfilPersonaResponseDto } from 'apps/people-service/src/Dtos';

@Injectable()
export class PerfilPersonaService implements IPerfilPersonaService {

  constructor(
    @InjectRepository(PerfilPersona)
    private perfilPersonaRepository: Repository<PerfilPersona>,
    private readonly securityServiceClient: SecurityServiceClient,
  ) {}

  async create(data: CreatePerfilPersonaDto): Promise<BaseResponseDto<PerfilPersona>> {
    try {
      if (!data) {
        return BaseResponseDto.error<PerfilPersona>(
          'No se proporcionaron datos para crear el perfil.',
          HttpStatus.BAD_REQUEST
        );
      }

      // Validación OBLIGATORIA: El usuario debe existir y estar activo
      const usuarioValidation = await this.securityServiceClient.validateUsuarioActive(data.usuarioId);
      if (!usuarioValidation.exists) {
        return BaseResponseDto.error<PerfilPersona>(
          'El usuario no existe en el sistema.',
          HttpStatus.BAD_REQUEST
        );
      }
      if (!usuarioValidation.active) {
        return BaseResponseDto.error<PerfilPersona>(
          'El usuario no está activo en el sistema.',
          HttpStatus.BAD_REQUEST
        );
      }

      // Verificar que no existe un perfil para este usuario
      const perfilExistente = await this.perfilPersonaRepository.findOne({
        where: { usuarioId: data.usuarioId },
      });

      if (perfilExistente) {
        return BaseResponseDto.error<PerfilPersona>(
          'Ya existe un perfil para este usuario.',
          HttpStatus.CONFLICT
        );
      }

      const newPerfil = this.perfilPersonaRepository.create(data);
      const savedPerfil = await this.perfilPersonaRepository.save(newPerfil);

      return BaseResponseDto.success<PerfilPersona>(
        savedPerfil,
        'Perfil de persona creado exitosamente.',
        HttpStatus.CREATED
      );
    } catch (error) {
      return BaseResponseDto.error<PerfilPersona>(
        'Error al crear el perfil de persona: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findAll(query: PerfilPersonaQuery = {}): Promise<BaseResponseDto<{ perfiles: PerfilPersonaResponseDto[], total: number, page: number, totalPages: number }>> {
    try {
      const { page = 1, limit = 10, usuarioId, estadoCivil, profesion } = query;

      const qb = this.perfilPersonaRepository.createQueryBuilder('perfil');

      if (usuarioId) {
        qb.andWhere('perfil.usuarioId = :usuarioId', { usuarioId });
      }

      if (estadoCivil) {
        qb.andWhere('perfil.estadoCivil = :estadoCivil', { estadoCivil });
      }

      if (profesion) {
        qb.andWhere('perfil.profesion ILIKE :profesion', { profesion: `%${profesion}%` });
      }

      qb.skip((page - 1) * limit)
        .take(limit)
        .orderBy('perfil.createdAt', 'DESC');

      const [perfiles, total] = await qb.getManyAndCount();
      const totalPages = Math.ceil(total / limit) || 1;

      const perfilesEnriquecidos = await this.enrichWithUsuarioData(perfiles);

      return BaseResponseDto.success({
        perfiles: perfilesEnriquecidos,
        total,
        page,
        totalPages,
      }, 'Perfiles obtenidos exitosamente.', HttpStatus.OK);
    } catch (error) {
      return BaseResponseDto.error(
        'Error al obtener los perfiles: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findOne(id: string): Promise<BaseResponseDto<PerfilPersonaResponseDto>> {
    try {
      const perfil = await this.perfilPersonaRepository.findOne({
        where: { id },
      });

      if (!perfil) {
        return BaseResponseDto.error(
          'Perfil no encontrado.',
          HttpStatus.NOT_FOUND
        );
      }

      const [perfilEnriquecido] = await this.enrichWithUsuarioData([perfil]);

      return BaseResponseDto.success(
        perfilEnriquecido,
        'Perfil obtenido exitosamente.',
        HttpStatus.OK
      );
    } catch (error) {
      return BaseResponseDto.error(
        'Error al obtener el perfil: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findByUsuarioId(usuarioId: string): Promise<BaseResponseDto<PerfilPersonaResponseDto>> {
    try {
      const perfil = await this.perfilPersonaRepository.findOne({
        where: { usuarioId },
      });

      if (!perfil) {
        return BaseResponseDto.error(
          'No se encontró perfil para este usuario.',
          HttpStatus.NOT_FOUND
        );
      }

      const [perfilEnriquecido] = await this.enrichWithUsuarioData([perfil]);

      return BaseResponseDto.success(
        perfilEnriquecido,
        'Perfil del usuario obtenido exitosamente.',
        HttpStatus.OK
      );
    } catch (error) {
      return BaseResponseDto.error(
        'Error al obtener el perfil del usuario: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async update(id: string, data: UpdatePerfilPersonaDto): Promise<BaseResponseDto<PerfilPersona>> {
    try {
      const perfilExistente = await this.perfilPersonaRepository.findOne({
        where: { id },
      });

      if (!perfilExistente) {
        return BaseResponseDto.error<PerfilPersona>(
          'Perfil no encontrado.',
          HttpStatus.NOT_FOUND
        );
      }

      // Validar que el usuario asociado sigue existiendo y activo
      const usuarioValidation = await this.securityServiceClient.validateUsuarioActive(perfilExistente.usuarioId);
      if (!usuarioValidation.exists) {
        return BaseResponseDto.error<PerfilPersona>(
          'El usuario asociado al perfil no existe en el sistema.',
          HttpStatus.BAD_REQUEST
        );
      }
      if (!usuarioValidation.active) {
        return BaseResponseDto.error<PerfilPersona>(
          'El usuario asociado al perfil no está activo en el sistema.',
          HttpStatus.BAD_REQUEST
        );
      }

      Object.assign(perfilExistente, data, { updatedAt: new Date() });
      const savedPerfil = await this.perfilPersonaRepository.save(perfilExistente);

      return BaseResponseDto.success<PerfilPersona>(
        savedPerfil,
        'Perfil actualizado exitosamente.',
        HttpStatus.OK
      );
    } catch (error) {
      return BaseResponseDto.error<PerfilPersona>(
        'Error al actualizar el perfil: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async remove(id: string): Promise<BaseResponseDto<void>> {
    try {
      const perfil = await this.perfilPersonaRepository.findOne({
        where: { id },
      });

      if (!perfil) {
        return BaseResponseDto.error<void>(
          'Perfil no encontrado.',
          HttpStatus.NOT_FOUND
        );
      }

      await this.perfilPersonaRepository.remove(perfil);

      return BaseResponseDto.success<void>(
        undefined,
        'Perfil eliminado exitosamente.',
        HttpStatus.OK
      );
    } catch (error) {
      return BaseResponseDto.error<void>(
        'Error al eliminar el perfil: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  private async enrichWithUsuarioData(perfiles: PerfilPersona[]): Promise<PerfilPersonaResponseDto[]> {
    const usuarioIds = perfiles.map(p => p.usuarioId);
    const uniqueUsuarioIds = [...new Set(usuarioIds)];
    const usuariosMap = await this.securityServiceClient.getMultipleUsuarios(uniqueUsuarioIds);

    return perfiles.map(perfil => {
      return new PerfilPersonaResponseDto({
        id: perfil.id,
        usuarioId: perfil.usuarioId,
        fotoUrl: perfil.fotoUrl || undefined,
        fechaNacimiento: perfil.fechaNacimiento || undefined,
        estadoCivil: perfil.estadoCivil || undefined,
        profesion: perfil.profesion || undefined,
        empresaTrabajo: perfil.empresaTrabajo || undefined,
        telefonoTrabajo: perfil.telefonoTrabajo || undefined,
        contactoEmergenciaNombre: perfil.contactoEmergenciaNombre || undefined,
        contactoEmergenciaTelefono: perfil.contactoEmergenciaTelefono || undefined,
        createdAt: perfil.createdAt!,
        updatedAt: perfil.updatedAt!,
        usuario: usuariosMap[perfil.usuarioId] ? {
          id: usuariosMap[perfil.usuarioId].id,
          nombre: usuariosMap[perfil.usuarioId].nombre,
          apellidos: usuariosMap[perfil.usuarioId].apellidos,
          email: usuariosMap[perfil.usuarioId].email,
          telefono: undefined, // Este campo vendría del usuario si está disponible
        } : undefined,
      });
    });
  }
}
