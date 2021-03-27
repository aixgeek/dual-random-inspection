import { Test, TestingModule } from '@nestjs/testing';
import { CloudBaseService } from '@/services';
import { DutyDepartmentController } from './duty-department.controller';
import { DutyDepartmentService } from './duty-department.service';

describe('DutyDepartmentController', () => {
  let controller: DutyDepartmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DutyDepartmentController],
      providers: [DutyDepartmentService, CloudBaseService],
    }).compile();

    controller = module.get<DutyDepartmentController>(DutyDepartmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
