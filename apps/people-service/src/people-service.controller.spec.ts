import { Test, TestingModule } from '@nestjs/testing';
import { PeopleServiceController } from './people-service.controller';
import { PeopleServiceService } from './people-service.service';

describe('PeopleServiceController', () => {
  let peopleServiceController: PeopleServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PeopleServiceController],
      providers: [PeopleServiceService],
    }).compile();

    peopleServiceController = app.get<PeopleServiceController>(
      PeopleServiceController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(peopleServiceController.getHello()).toBe('Hello World!');
    });
  });
});
