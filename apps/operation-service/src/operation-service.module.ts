import { Module } from '@nestjs/common';
import { OperationServiceController } from './operation-service.controller';
import { OperationServiceService } from './operation-service.service';

@Module({
  imports: [],
  controllers: [OperationServiceController],
  providers: [OperationServiceService],
})
export class OperationServiceModule {}
