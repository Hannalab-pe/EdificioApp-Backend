import { Injectable } from '@nestjs/common';

@Injectable()
export class SecurityServiceService {
  getHello(): string {
    return 'Security Service - Ready to develop!';
  }
}
