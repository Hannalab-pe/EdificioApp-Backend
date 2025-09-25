import { Test, TestingModule } from '@nestjs/testing';
import { SecurityServiceController } from './security-service.controller';
import { SecurityServiceService } from './security-service.service';

describe('SecurityServiceController', () => {
  let securityServiceController: SecurityServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SecurityServiceController],
      providers: [SecurityServiceService],
    }).compile();

    securityServiceController = app.get<SecurityServiceController>(SecurityServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(securityServiceController.getHello()).toBe('Hello World!');
    });
  });
});
