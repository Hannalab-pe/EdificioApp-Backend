import { Test, TestingModule } from '@nestjs/testing';
import { PropertyServiceController } from './property-service.controller';
import { PropertyServiceService } from './property-service.service';

describe('PropertyServiceController', () => {
  let propertyServiceController: PropertyServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PropertyServiceController],
      providers: [PropertyServiceService],
    }).compile();

    propertyServiceController = app.get<PropertyServiceController>(PropertyServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(propertyServiceController.getHello()).toBe('Hello World!');
    });
  });
});
