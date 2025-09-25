import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfiguracionSeguridad } from '../entities/configuracion-seguridad.entity';
import { CreateSecurityConfigDto } from './dto/create-security-config.dto';
import { UpdateSecurityConfigDto } from './dto/update-security-config.dto';
import { SecurityConfigResponseDto } from './dto/security-config-response.dto';

@Injectable()
export class SecurityConfigService {
  constructor(
    @InjectRepository(ConfiguracionSeguridad)
    private configRepository: Repository<ConfiguracionSeguridad>,
  ) {}

  async create(createConfigDto: CreateSecurityConfigDto): Promise<SecurityConfigResponseDto> {
    const { clave } = createConfigDto;

    // Verificar si la clave ya existe
    const existingConfig = await this.configRepository.findOne({ where: { clave } });
    if (existingConfig) {
      throw new ConflictException('Ya existe una configuración con esa clave');
    }

    // Crear la configuración
    const config = await this.configRepository.save(createConfigDto);

    return this.mapToConfigResponse(config);
  }

  async findAll(): Promise<SecurityConfigResponseDto[]> {
    const configs = await this.configRepository.find({
      where: { activo: true },
      order: { clave: 'ASC' },
    });

    return configs.map(config => this.mapToConfigResponse(config));
  }

  async findOne(id: number): Promise<SecurityConfigResponseDto> {
    const config = await this.configRepository.findOne({
      where: { id, activo: true },
    });

    if (!config) {
      throw new NotFoundException('Configuración no encontrada');
    }

    return this.mapToConfigResponse(config);
  }

  async findByKey(clave: string): Promise<SecurityConfigResponseDto> {
    const config = await this.configRepository.findOne({
      where: { clave, activo: true },
    });

    if (!config) {
      throw new NotFoundException('Configuración no encontrada');
    }

    return this.mapToConfigResponse(config);
  }

  async update(id: number, updateConfigDto: UpdateSecurityConfigDto): Promise<SecurityConfigResponseDto> {
    const config = await this.configRepository.findOne({
      where: { id, activo: true },
    });

    if (!config) {
      throw new NotFoundException('Configuración no encontrada');
    }

    // Actualizar la configuración
    await this.configRepository.update(id, updateConfigDto);

    // Cargar configuración actualizada
    const configActualizada = await this.configRepository.findOne({
      where: { id },
    });

    if (!configActualizada) {
      throw new BadRequestException('Error al actualizar la configuración');
    }

    return this.mapToConfigResponse(configActualizada);
  }

  async updateByKey(clave: string, updateConfigDto: UpdateSecurityConfigDto): Promise<SecurityConfigResponseDto> {
    const config = await this.configRepository.findOne({
      where: { clave, activo: true },
    });

    if (!config) {
      throw new NotFoundException('Configuración no encontrada');
    }

    // Actualizar la configuración
    await this.configRepository.update(config.id, updateConfigDto);

    // Cargar configuración actualizada
    const configActualizada = await this.configRepository.findOne({
      where: { id: config.id },
    });

    if (!configActualizada) {
      throw new BadRequestException('Error al actualizar la configuración');
    }

    return this.mapToConfigResponse(configActualizada);
  }

  async remove(id: number): Promise<{ message: string }> {
    const config = await this.configRepository.findOne({
      where: { id, activo: true },
    });

    if (!config) {
      throw new NotFoundException('Configuración no encontrada');
    }

    // Verificar si es una configuración crítica que no se puede eliminar
    const criticalKeys = ['JWT_SECRET', 'JWT_EXPIRES_IN', 'BCRYPT_ROUNDS'];
    if (criticalKeys.includes(config.clave)) {
      throw new BadRequestException('No se puede eliminar configuraciones críticas del sistema');
    }

    // Soft delete
    await this.configRepository.update(id, { activo: false });

    return { message: 'Configuración eliminada exitosamente' };
  }

  async getConfigValue(clave: string): Promise<string | null> {
    const config = await this.configRepository.findOne({
      where: { clave, activo: true },
      select: ['valor'],
    });

    return config ? config.valor : null;
  }

  async setConfigValue(clave: string, valor: string, descripcion?: string): Promise<SecurityConfigResponseDto> {
    let config = await this.configRepository.findOne({ where: { clave } });

    if (config) {
      // Actualizar configuración existente
      await this.configRepository.update(config.id, {
        valor,
        descripcion: descripcion || config.descripcion,
        activo: true,
      });

      config = await this.configRepository.findOne({ where: { id: config.id } });
    } else {
      // Crear nueva configuración
      config = await this.configRepository.save({
        clave,
        valor,
        descripcion,
      });
    }

    if (!config) {
      throw new BadRequestException('Error al guardar la configuración');
    }

    return this.mapToConfigResponse(config);
  }

  async getSecuritySettings(): Promise<Record<string, string>> {
    const configs = await this.configRepository.find({
      where: { activo: true },
      select: ['clave', 'valor'],
    });

    const settings: Record<string, string> = {};
    configs.forEach(config => {
      settings[config.clave] = config.valor;
    });

    return settings;
  }

  private mapToConfigResponse(config: ConfiguracionSeguridad): SecurityConfigResponseDto {
    return {
      id: config.id,
      clave: config.clave,
      valor: config.valor,
      descripcion: config.descripcion,
      activo: config.activo,
      updatedAt: config.updatedAt,
    };
  }
}