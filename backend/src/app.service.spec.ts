import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    // We create a "testing module" that acts like a miniature version of our app
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('should return the correct root message', () => {
    const result = service.getRootDirMessage();
    // This is our "assertion" - it proves the code does exactly what we expect
    expect(result).toEqual({ message: 'ShahdCosmetics API is running!' });
  });
});