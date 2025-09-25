import { Injectable } from '@nestjs/common';

@Injectable()
export class ExternalServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
