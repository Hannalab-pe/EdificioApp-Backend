import { Test, TestingModule } from '@nestjs/testing';
import { ResidentServiceController } from './resident-service.controller';
import { ResidentServiceService } from './resident-service.service';

describe('ResidentServiceController', () => {
  let residentServiceController: ResidentServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ResidentServiceController],
      providers: [ResidentServiceService],
    }).compile();

    residentServiceController = app.get<ResidentServiceController>(ResidentServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(residentServiceController.getHello()).toBe('Hello World!');
    });
  });
});
