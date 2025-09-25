import { Injectable } from '@nestjs/common';

@Injectable()
export class SecurityServiceService {
  getHello(): string {
    return 'Hello World!';
  }

  getInfo() {
    return {
      service: 'Security Service',
      version: '1.0.0',
      description: 'Servicio de seguridad para el sistema de condominios',
      status: 'active'
    };
  }

  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      service: 'Security Service'
    };
  }
}
