import { Test, TestingModule } from '@nestjs/testing';
import { GlobalModule } from '@/global.module';
import { DoubleRandomInspectionService } from './double-random-inspection.service';

describe('DoubleRandomInspectionService', () => {
  let service: DoubleRandomInspectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [GlobalModule],
      providers: [DoubleRandomInspectionService],
    }).compile();

    service = module.get<DoubleRandomInspectionService>(
      DoubleRandomInspectionService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
