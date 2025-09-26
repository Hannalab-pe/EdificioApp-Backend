import { Test, TestingModule } from '@nestjs/testing';
import { ExternalServiceController } from './external-service.controller';
import { ExternalServiceService } from './external-service.service';

describe('ExternalServiceController', () => {
  let externalServiceController: ExternalServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ExternalServiceController],
      providers: [ExternalServiceService],
    }).compile();

    externalServiceController = app.get<ExternalServiceController>(
      ExternalServiceController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(externalServiceController.getHello()).toBe('Hello World!');
    });
  });
});
