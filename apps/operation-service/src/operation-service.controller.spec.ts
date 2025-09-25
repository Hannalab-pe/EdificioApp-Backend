import { Test, TestingModule } from '@nestjs/testing';
import { OperationServiceController } from './operation-service.controller';
import { OperationServiceService } from './operation-service.service';

describe('OperationServiceController', () => {
  let operationServiceController: OperationServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [OperationServiceController],
      providers: [OperationServiceService],
    }).compile();

    operationServiceController = app.get<OperationServiceController>(OperationServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(operationServiceController.getHello()).toBe('Hello World!');
    });
  });
});
