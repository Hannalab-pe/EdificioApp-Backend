import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout, catchError } from 'rxjs';

@Injectable()
export class ApiGatewayService {
  private readonly logger = new Logger(ApiGatewayService.name);

  constructor(
    @Inject('AUTH_SERVICE') private authService: ClientProxy,
    @Inject('PEOPLE_SERVICE') private peopleService: ClientProxy,
    @Inject('PROPERTY_SERVICE') private propertyService: ClientProxy,
  ) { }

  getInfo() {
    return {
      name: 'Condominio System API Gateway',
      version: '1.0.0',
      description: 'Gateway para sistema de gestión de condominios',
      microservices: [
        'auth-service',
        'people-service',
        'property-service',
        'financial-service',
        'operations-service',
        'resident-service',
        'governance-service',
        'external-service',
        'payment-gateway',
        'integrations-service'
      ],
      timestamp: new Date().toISOString(),
    };
  }

  async getSystemStatus() {
    const services = [
      { name: 'auth-service', client: this.authService },
      { name: 'people-service', client: this.peopleService },
      { name: 'property-service', client: this.propertyService },
    ];

    const status = await Promise.allSettled(
      services.map(async (service) => {
        try {
          const response = await firstValueFrom(
            service.client.send('health.check', {}).pipe(
              timeout(5000),
              catchError(error => {
                this.logger.error(`Health check failed for ${service.name}: ${error.message}`);
                throw error;
              })
            )
          );
          return { name: service.name, status: 'healthy', response };
        } catch (error) {
          return {
            name: service.name,
            status: 'unhealthy',
            error: error.message
          };
        }
      })
    );

    return {
      gateway: 'healthy',
      timestamp: new Date().toISOString(),
      services: status.map(result =>
        result.status === 'fulfilled' ? result.value : result.reason
      ),
    };
  }
}