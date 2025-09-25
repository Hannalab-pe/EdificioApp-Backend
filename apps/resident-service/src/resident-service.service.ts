import { Injectable } from '@nestjs/common';

@Injectable()
export class ResidentServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
