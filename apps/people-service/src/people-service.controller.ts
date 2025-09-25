import { Controller, Get } from '@nestjs/common';
import { PeopleServiceService } from './people-service.service';

@Controller()
export class PeopleServiceController {
  constructor(private readonly peopleServiceService: PeopleServiceService) {}

  @Get()
  getHello(): string {
    return this.peopleServiceService.getHello();
  }
}
