import { Controller, Get } from '@nestjs/common';
import { ResidentServiceService } from './resident-service.service';

@Controller()
export class ResidentServiceController {
  constructor(
    private readonly residentServiceService: ResidentServiceService,
  ) {}

  @Get()
  getHello(): string {
    return this.residentServiceService.getHello();
  }
}
