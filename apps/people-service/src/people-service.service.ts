import { Injectable } from '@nestjs/common';

@Injectable()
export class PeopleServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
