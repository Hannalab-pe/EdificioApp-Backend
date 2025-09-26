import { Controller, Get } from '@nestjs/common';
import { PropertyServiceService } from './property-service.service';

@Controller()
export class PropertyServiceController {
  constructor(
    private readonly propertyServiceService: PropertyServiceService,
  ) {}

  @Get()
  getHello(): string {
    return this.propertyServiceService.getHello();
  }
}
