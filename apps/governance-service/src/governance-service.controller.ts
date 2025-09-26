import { Controller, Get } from '@nestjs/common';
import { GovernanceServiceService } from './governance-service.service';

@Controller()
export class GovernanceServiceController {
  constructor(
    private readonly governanceServiceService: GovernanceServiceService,
  ) {}

  @Get()
  getHello(): string {
    return this.governanceServiceService.getHello();
  }
}
