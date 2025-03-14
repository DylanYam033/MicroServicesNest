import { Test, TestingModule } from '@nestjs/testing';
import { NewMembersController } from './new-members.controller';

describe('NewMembersController', () => {
  let controller: NewMembersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NewMembersController],
    }).compile();

    controller = module.get<NewMembersController>(NewMembersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
