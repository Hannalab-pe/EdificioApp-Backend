import { Injectable } from '@nestjs/common';

@Injectable()
export class GovernanceServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
