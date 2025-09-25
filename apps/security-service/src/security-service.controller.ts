import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SecurityServiceService } from './security-service.service';

@ApiTags('Security Service')
@Controller()
export class SecurityServiceController {
  constructor(private readonly securityServiceService: SecurityServiceService) { }

  @Get()
  @ApiOperation({ summary: 'Información del Security Service' })
  @ApiResponse({ status: 200, description: 'Información del servicio' })
  getInfo() {
    return this.securityServiceService.getInfo();
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check del Security Service' })
  @ApiResponse({ status: 200, description: 'Servicio saludable' })
  getHealth() {
    return this.securityServiceService.getHealth();
  }
}
