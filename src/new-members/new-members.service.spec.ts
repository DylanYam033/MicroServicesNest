import { Test, TestingModule } from '@nestjs/testing';
import { NewMembersService } from './new-members.service';

describe('NewMembersService', () => {
  let service: NewMembersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NewMembersService],
    }).compile();

    service = module.get<NewMembersService>(NewMembersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
