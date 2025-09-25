import { Controller, Get } from '@nestjs/common';
import { SecurityServiceService } from './security-service.service';

@Controller()
export class SecurityServiceController {
  constructor(private readonly securityServiceService: SecurityServiceService) {}

  @Get()
  getHello(): string {
    return this.securityServiceService.getHello();
  }
}
