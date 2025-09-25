import { Module } from '@nestjs/common';
import { PeopleServiceController } from './people-service.controller';
import { PeopleServiceService } from './people-service.service';
import { ServicesModule } from './Services/services.module';
import { EntitiesModule } from './entities/entities.module';
import { ControllersModule } from './Controllers/controllers.module';

@Module({
  imports: [ServicesModule,
    ControllersModule,
    EntitiesModule,
  ],
  controllers: [PeopleServiceController],
  providers: [PeopleServiceService],
})
export class PeopleServiceModule { }
