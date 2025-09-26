import { Test, TestingModule } from '@nestjs/testing';
import { GovernanceServiceController } from './governance-service.controller';
import { GovernanceServiceService } from './governance-service.service';

describe('GovernanceServiceController', () => {
  let governanceServiceController: GovernanceServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [GovernanceServiceController],
      providers: [GovernanceServiceService],
    }).compile();

    governanceServiceController = app.get<GovernanceServiceController>(
      GovernanceServiceController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(governanceServiceController.getHello()).toBe('Hello World!');
    });
  });
});
