import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiGatewayService } from './api-gateway.service';

@ApiTags('General')
@Controller()
export class ApiGatewayController {
  constructor(private readonly apiGatewayService: ApiGatewayService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener información del API Gateway' })
  @ApiResponse({ status: 200, description: 'Información del gateway' })
  getInfo() {
    return this.apiGatewayService.getInfo();
  }

  @Get('status')
  @ApiOperation({ summary: 'Estado del sistema' })
  @ApiResponse({ status: 200, description: 'Estado de los microservicios' })
  async getStatus() {
    return this.apiGatewayService.getSystemStatus();
  }
}
