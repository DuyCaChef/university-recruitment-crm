import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('health check', () => {
    it('should return health check status "ok"', () => {
      const result = appController.getHealthCheck();
      expect(result).toHaveProperty('status', 'ok');
      expect(result).toHaveProperty('timestamp');
    });
  });
});

