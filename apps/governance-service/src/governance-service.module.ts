import { Module } from '@nestjs/common';
import { GovernanceServiceController } from './governance-service.controller';
import { GovernanceServiceService } from './governance-service.service';

@Module({
  imports: [],
  controllers: [GovernanceServiceController],
  providers: [GovernanceServiceService],
})
export class GovernanceServiceModule {}
