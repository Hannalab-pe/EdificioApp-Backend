import { Injectable } from '@nestjs/common';

@Injectable()
export class PropertyServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
