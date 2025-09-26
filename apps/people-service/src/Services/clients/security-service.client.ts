import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsuarioBasicoDto } from '../../Dtos/historial-contrato.dto';

@Injectable()
export class SecurityServiceClient {
  private readonly logger = new Logger(SecurityServiceClient.name);

  constructor(private readonly configService: ConfigService) {}

  async getUsuarioById(usuarioId: string): Promise<UsuarioBasicoDto | null> {
    const baseUrl = this.getSecurityServiceBaseUrl();

    try {
      const response = await fetch(`${baseUrl}/usuario/${usuarioId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 404) {
        this.logger.warn(`Usuario no encontrado: ${usuarioId}`);
        return null;
      }

      if (!response.ok) {
        this.logger.error(`Error al obtener usuario ${usuarioId}: ${response.status} ${response.statusText}`);
        return null;
      }

      const result = await response.json();

      if (result.success && result.data) {
        return new UsuarioBasicoDto({
          id: result.data.id,
          nombre: result.data.nombre,
          apellidos: result.data.apellidos,
          email: result.data.email,
        });
      }

      return null;
    } catch (error) {
      this.logger.error('Error al comunicarse con security-service:', error);
      return null;
    }
  }

  async getMultipleUsuarios(usuarioIds: string[]): Promise<Record<string, UsuarioBasicoDto>> {
    const results: Record<string, UsuarioBasicoDto> = {};

    for (const id of usuarioIds) {
      const usuario = await this.getUsuarioById(id);
      if (usuario) {
        results[id] = usuario;
      }
    }

    return results;
  }

  async validateUsuarioExists(usuarioId: string): Promise<boolean> {
    try {
      const usuario = await this.getUsuarioById(usuarioId);
      return usuario !== null;
    } catch (error) {
      this.logger.error(`Error validando usuario ${usuarioId}:`, error);
      return false;
    }
  }

  async validateUsuarioActive(usuarioId: string): Promise<{ exists: boolean; active: boolean; usuario?: UsuarioBasicoDto }> {
    const baseUrl = this.getSecurityServiceBaseUrl();

    try {
      const response = await fetch(`${baseUrl}/usuario/${usuarioId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 404) {
        return { exists: false, active: false };
      }

      if (!response.ok) {
        this.logger.error(`Error al validar usuario ${usuarioId}: ${response.status} ${response.statusText}`);
        return { exists: false, active: false };
      }

      const result = await response.json();

      if (result.success && result.data) {
        const usuario = new UsuarioBasicoDto({
          id: result.data.id,
          nombre: result.data.nombre,
          apellidos: result.data.apellidos,
          email: result.data.email,
        });

        return {
          exists: true,
          active: result.data.activo === true,
          usuario
        };
      }

      return { exists: false, active: false };
    } catch (error) {
      this.logger.error('Error al validar estado del usuario:', error);
      return { exists: false, active: false };
    }
  }

  private getSecurityServiceBaseUrl(): string {
    const explicitUrl = this.configService.get<string>('SECURITY_SERVICE_URL');

    if (explicitUrl) {
      return explicitUrl.replace(/\/$/, '');
    }

    const port = this.configService.get<number>('AUTH_SERVICE_PORT') ?? 3003;
    return `http://localhost:${port}/api/v1`;
  }
}