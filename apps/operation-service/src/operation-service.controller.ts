import { Controller, Get } from '@nestjs/common';
import { OperationServiceService } from './operation-service.service';

@Controller()
export class OperationServiceController {
  constructor(private readonly operationServiceService: OperationServiceService) {}

  @Get()
  getHello(): string {
    return this.operationServiceService.getHello();
  }
}
