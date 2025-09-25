import { Injectable } from '@nestjs/common';

@Injectable()
export class OperationServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
