import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let controller: AppController;
  let service: AppService;

  beforeEach(async () => {
    // We manually create the service and controller without Nest's complex injector
    service = new AppService();
    controller = new AppController(service);
  });

  it('should return the correct message from the service', () => {
    const result = controller.getRootResponse();
    expect(result.message).toBe('ShahdCosmetics API is running!');
  });
});