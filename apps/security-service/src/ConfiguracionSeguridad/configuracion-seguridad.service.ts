import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IConfiguracionSeguridadService } from './IConfiguracionSeguridadService';
import { CreateConfiguracionSeguridadDto } from './Dtos/CreateConfiguracionSeguridadDto';
import { UpdateConfiguracionSeguridadDto } from './Dtos/UpdateConfiguracionSeguridadDto';
import { ConfiguracionSeguridad } from '../entities/configuracion-seguridad.entity';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class ConfiguracionSeguridadService
  implements IConfiguracionSeguridadService
{
  constructor(
    @InjectRepository(ConfiguracionSeguridad)
    private configuracionSeguridadRepository: Repository<ConfiguracionSeguridad>,
  ) {}

  async create(
    createConfiguracionSeguridadDto: CreateConfiguracionSeguridadDto,
  ): Promise<ConfiguracionSeguridad> {
    const configuracion = this.configuracionSeguridadRepository.create(
      createConfiguracionSeguridadDto,
    );
    return await this.configuracionSeguridadRepository.save(configuracion);
  }

  async findAll(): Promise<ConfiguracionSeguridad[]> {
    return await this.configuracionSeguridadRepository.find();
  }

  async findOne(id: number): Promise<ConfiguracionSeguridad | null> {
    return await this.configuracionSeguridadRepository.findOne({
      where: { id },
    });
  }

  async update(
    id: number,
    updateConfiguracionSeguridadDto: UpdateConfiguracionSeguridadDto,
  ): Promise<ConfiguracionSeguridad> {
    await this.configuracionSeguridadRepository.update(
      id,
      updateConfiguracionSeguridadDto,
    );
    const updated = await this.findOne(id);
    if (!updated) throw new NotFoundException('Configuración no encontrada');
    return updated;
  }

  async remove(id: number): Promise<void> {
    await this.configuracionSeguridadRepository.delete(id);
  }

  async findByTipo(tipo: string): Promise<ConfiguracionSeguridad | null> {
    return await this.configuracionSeguridadRepository.findOne({
      where: { tipo },
    });
  }

  async findByEstado(activa: boolean): Promise<ConfiguracionSeguridad[]> {
    return await this.configuracionSeguridadRepository.find({
      where: { activa },
    });
  }

  async updateValorByTipo(
    tipo: string,
    valor: string,
  ): Promise<ConfiguracionSeguridad> {
    await this.configuracionSeguridadRepository.update({ tipo }, { valor });
    const updated = await this.findByTipo(tipo);
    if (!updated) throw new NotFoundException('Configuración no encontrada');
    return updated;
  }

  async getConfiguracionesActivas(): Promise<ConfiguracionSeguridad[]> {
    return await this.configuracionSeguridadRepository.find({
      where: { activa: true },
    });
  }

  async getConfiguracionPorDefecto(
    tipo: string,
  ): Promise<ConfiguracionSeguridad | null> {
    return await this.configuracionSeguridadRepository.findOne({
      where: { tipo, activa: true },
    });
  }
}
