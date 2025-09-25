import { Controller, Get } from '@nestjs/common';
import { ExternalServiceService } from './external-service.service';

@Controller()
export class ExternalServiceController {
  constructor(private readonly externalServiceService: ExternalServiceService) {}

  @Get()
  getHello(): string {
    return this.externalServiceService.getHello();
  }
}
