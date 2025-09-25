import { Module } from '@nestjs/common';
import { ResidentServiceController } from './resident-service.controller';
import { ResidentServiceService } from './resident-service.service';

@Module({
  imports: [],
  controllers: [ResidentServiceController],
  providers: [ResidentServiceService],
})
export class ResidentServiceModule {}
