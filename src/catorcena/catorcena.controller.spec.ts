import { Test, TestingModule } from '@nestjs/testing';
import { CatorcenaController } from './catorcena.controller';

describe('CatorcenaController', () => {
  let controller: CatorcenaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatorcenaController],
    }).compile();

    controller = module.get<CatorcenaController>(CatorcenaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
