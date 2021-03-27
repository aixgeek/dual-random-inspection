import { Test, TestingModule } from '@nestjs/testing';
import { CloudBaseService } from '@/services';
import { InspectionMatterService } from './inspection-matter.service';

describe('InspectionMatterService', () => {
  let service: InspectionMatterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InspectionMatterService, CloudBaseService],
    }).compile();

    service = module.get<InspectionMatterService>(InspectionMatterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  
});
