import { CreateConfiguracionSeguridadDto } from './Dtos/CreateConfiguracionSeguridadDto';
import { UpdateConfiguracionSeguridadDto } from './Dtos/UpdateConfiguracionSeguridadDto';
import { ConfiguracionSeguridad } from '../entities/configuracion-seguridad.entity';

export interface IConfiguracionSeguridadService {
  create(
    createConfiguracionSeguridadDto: CreateConfiguracionSeguridadDto,
  ): Promise<ConfiguracionSeguridad>;
  findAll(): Promise<ConfiguracionSeguridad[]>;
  findOne(id: number): Promise<ConfiguracionSeguridad | null>;
  update(
    id: number,
    updateConfiguracionSeguridadDto: UpdateConfiguracionSeguridadDto,
  ): Promise<ConfiguracionSeguridad>;
  remove(id: number): Promise<void>;
  findByTipo(tipo: string): Promise<ConfiguracionSeguridad | null>;
  findByEstado(activa: boolean): Promise<ConfiguracionSeguridad[]>;
  updateValorByTipo(
    tipo: string,
    valor: string,
  ): Promise<ConfiguracionSeguridad>;
  getConfiguracionesActivas(): Promise<ConfiguracionSeguridad[]>;
  getConfiguracionPorDefecto(
    tipo: string,
  ): Promise<ConfiguracionSeguridad | null>;
}
