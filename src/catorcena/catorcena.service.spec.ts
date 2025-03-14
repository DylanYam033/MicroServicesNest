import { Test, TestingModule } from '@nestjs/testing';
import { CatorcenaService } from './catorcena.service';

describe('CatorcenaService', () => {
  let service: CatorcenaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CatorcenaService],
    }).compile();

    service = module.get<CatorcenaService>(CatorcenaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
