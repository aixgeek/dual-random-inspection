import { Test, TestingModule } from '@nestjs/testing';
import { CloudBaseService } from '@/services';
import { DoubleRandomResultService } from './double-random-result.service';

describe('DoubleRandomResultService', () => {
  let service: DoubleRandomResultService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DoubleRandomResultService, CloudBaseService],
    }).compile();

    service = module.get<DoubleRandomResultService>(DoubleRandomResultService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  
});
