import { Module } from '@nestjs/common';
import { PeopleServiceController } from './people-service.controller';
import { PeopleServiceService } from './people-service.service';

@Module({
  imports: [],
  controllers: [PeopleServiceController],
  providers: [PeopleServiceService],
})
export class PeopleServiceModule {}
