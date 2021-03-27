import { Test, TestingModule } from '@nestjs/testing';
import { CloudBaseService } from '@/services';
import { DutyDepartmentService } from './duty-department.service';

describe('DutyDepartmentService', () => {
  let service: DutyDepartmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DutyDepartmentService, CloudBaseService],
    }).compile();

    service = module.get<DutyDepartmentService>(DutyDepartmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
