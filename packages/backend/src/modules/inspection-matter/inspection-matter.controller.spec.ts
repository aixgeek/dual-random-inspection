import { Test, TestingModule } from '@nestjs/testing';
import { CloudBaseService } from '@/services';
import { InspectionMatterController } from './inspection-matter.controller';
import { InspectionMatterService } from './inspection-matter.service';

describe('InspectionMatterController', () => {
  let controller: InspectionMatterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InspectionMatterController],
      providers: [InspectionMatterService, CloudBaseService],
    }).compile();

    controller = module.get<InspectionMatterController>(
      InspectionMatterController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
