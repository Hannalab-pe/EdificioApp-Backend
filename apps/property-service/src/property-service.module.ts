import { Module } from '@nestjs/common';
import { PropertyServiceController } from './property-service.controller';
import { PropertyServiceService } from './property-service.service';

@Module({
  imports: [],
  controllers: [PropertyServiceController],
  providers: [PropertyServiceService],
})
export class PropertyServiceModule {}
